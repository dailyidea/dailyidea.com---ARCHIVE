import boto3
import logging
import uuid
import json

import os

dynamodb = boto3.client('dynamodb', region_name=os.environ['AWS_REGION'])
lambda_client = boto3.client('lambda', region_name=os.environ['AWS_REGION'])
logger = logging.getLogger()
logger.setLevel(logging.INFO)

SET_USERS_SLUG_FUNCTION_NAME = os.environ.get('SET_USERS_SLUG_FUNCTION_NAME')
UPDATE_PROFILE_INFO_IN_CREATED_IDEAS_FUNCTION_NAME = os.environ.get(
    'UPDATE_PROFILE_INFO_IN_CREATED_IDEAS_FUNCTION_NAME')
USERS_TABLE_NAME = os.environ.get('USERS_TABLE_NAME')


def endpoint(event, lambda_context):
    ctx = event.get('ctx')
    arguments = ctx.get('arguments')

    name = arguments.get('name')
    bio = arguments.get('bio')
    interestedInTags = arguments.get('interestedInTags')
    profile_id = ctx.get('identity').get('username')

    if not name:
        return {'result': {'ok': False, 'error': 'Name is required'}}
    if len(name) < 3:
        return {'result': {'ok': False, 'error': 'Name must be at least 3 characters'}}
    if bio and len(bio) > 1000:
        return {'result': {'ok': False, 'error': 'Bio must be at most 1000 characters'}}

    logger.info('{},{},{}'.format(profile_id, name, bio))
    profile = dynamodb.get_item(
        TableName=USERS_TABLE_NAME,
        Key={'userId': {"S": profile_id}},
    ).get('Item')
    slug = profile.get('slug').get('S') if profile.get('slug') else None
    if profile['name']['S'] != name:
        response = lambda_client.invoke(
            FunctionName=SET_USERS_SLUG_FUNCTION_NAME,
            InvocationType='RequestResponse',
            LogType='Tail',
            Payload=json.dumps({'userName': name, 'userId': profile_id}),
        )
        slug = json.loads(response['Payload'].read())['slug']
        dynamodb.update_item(
            TableName=USERS_TABLE_NAME,
            Key={'userId': {"S": profile_id}},
            AttributeUpdates={
                "name": {
                    'Value': {'S': name},
                    'Action': 'PUT',
                },
            }
        )
        lambda_client.invoke(
            FunctionName=UPDATE_PROFILE_INFO_IN_CREATED_IDEAS_FUNCTION_NAME,
            InvocationType='Event',
            LogType='Tail',
            Payload=json.dumps({'userId': profile_id, 'authorName': name, 'authorSlug': slug}),
        )
    if bio and profile.get('bio') is None or (profile.get('bio') and profile.get('bio').get('S') != bio):
        dynamodb.update_item(
            TableName=USERS_TABLE_NAME,
            Key={'userId': {"S": profile_id}},
            AttributeUpdates={
                "bio": {
                    'Value': {'S': bio} if bio else {'NULL': True},
                    'Action': 'PUT',
                },
            }
        )
    if interestedInTags and len(interestedInTags):
        dynamodb.update_item(
            TableName=USERS_TABLE_NAME,
            Key={'userId': {"S": profile_id}},
            AttributeUpdates={
                "interestedInTags": {
                    'Value': {'SS': interestedInTags[:50]},
                    'Action': 'PUT',
                },
            }
        )
    elif profile.get('interestedInTags') and profile.get('interestedInTags').get('SS') is not None:
        dynamodb.update_item(
            TableName=USERS_TABLE_NAME,
            Key={'userId': {"S": profile_id}},
            AttributeUpdates={
                "interestedInTags": {
                    'Value': {'NULL': True},
                    'Action': 'PUT',
                },
            }
        )

    return {
        'result': {'ok': True},
        'updatedInfo': {'name': name, 'slug': slug, 'bio': bio, 'interestedInTags': interestedInTags}
    }
