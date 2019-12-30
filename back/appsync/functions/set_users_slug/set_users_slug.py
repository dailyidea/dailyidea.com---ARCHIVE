import boto3
# import logging
from slugify import slugify
import uuid

# import datetime
import os

client = boto3.client('dynamodb', region_name='us-east-1')
# logger = logging.getLogger()
# logger.setLevel(logging.INFO)


def make_slug_unique(user_id, wanted_slug, first_run=True):
    resp = client.query(
        TableName=os.environ.get('USERS_TABLE_NAME'),
        IndexName='slugIndex',
        KeyConditionExpression='slug=:slug',
        ExpressionAttributeValues={
            ":slug": {"S": wanted_slug}
        }
    )
    while len(resp.get('Items')) > 0 and resp.get('Items')[0]['userId']["S"] != user_id:
        assumed_unique_part = str(uuid.uuid4()).split('-')[3]
        if first_run:
            assumed_new_slug = wanted_slug + '-' + assumed_unique_part
        else:
            assumed_new_slug = '-'.join(wanted_slug.split('-')[:-1]) + '-' + assumed_unique_part
        return make_slug_unique(user_id, assumed_new_slug, first_run=False)
    return wanted_slug


def set_users_slug(user_id, slug):
    client.update_item(
        TableName=os.environ.get('USERS_TABLE_NAME'),
        Key={'userId': {"S": user_id}},
        AttributeUpdates={
            "slug": {
                'Value': {'S': slug},
                'Action': 'PUT',
            },
        }
    )


def endpoint(payload, lambda_context):
    user_name = payload.get('userName')
    user_id = payload.get('userId')
    assert user_name and user_id and len(user_name) >= 3
    wanted_user_slug = slugify(user_name)
    unique_user_slug = make_slug_unique(user_id, wanted_user_slug)
    set_users_slug(user_id, unique_user_slug)
    return {'slug': unique_user_slug}
