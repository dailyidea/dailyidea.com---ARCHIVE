import boto3
import logging
import sys
from PIL import Image
from io import BytesIO
import base64
import os
import uuid
import json
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

sentry_sdk.init(dsn=os.environ.get('SENTRY_DSN'), integrations=[AwsLambdaIntegration()])

# logger = logging.getLogger()
# logger.setLevel(logging.INFO)

BUCKET_URL_PREFIX = os.environ['AVATAR_STATIC_BUCKET_URL']
BUCKET_NAME = os.environ['AVATAR_STATIC_BUCKET_NAME']
USERS_TABLE_NAME = os.environ.get('USERS_TABLE_NAME')
s3_client = boto3.client('s3', region_name=os.environ['AWS_REGION'])
dynamodb_client = boto3.client('dynamodb', region_name=os.environ['AWS_REGION'])
lambda_client = boto3.client('lambda', region_name=os.environ['AWS_REGION'])
UPDATE_PROFILE_INFO_IN_CREATED_IDEAS_FUNCTION_NAME = os.environ.get(
    'UPDATE_PROFILE_INFO_IN_CREATED_IDEAS_FUNCTION_NAME')

def endpoint(event, lambda_context):
    ctx = event.get('ctx')
    arguments = ctx.get('arguments')
    identity = ctx.get('identity')
    profile_id = identity.get('username')

    profile = dynamodb_client.get_item(
        TableName=USERS_TABLE_NAME,
        Key={'userId': {"S": profile_id}},
    ).get('Item')

    old_avatar = profile.get('avatar', None)
    key_to_delete = None
    if old_avatar:
        old_avatar = old_avatar.get('S')
        key_to_delete = old_avatar.split('/')[-1]
    size = sys.getsizeof(arguments['avatar'])
    if size > 1024 * 1024 * 10:  # 10 Mb max
        return {'result': {'ok': False, 'error': 'Too large file'}}
    im = Image.open(BytesIO(base64.b64decode(arguments['avatar'])))
    im = im.resize((512, 512))
    temp = BytesIO()
    im.save(temp, format="jpeg", quality=100)
    temp.seek(0)
    new_name = f"daily-idea-avatar-{profile_id}-{str(uuid.uuid4()).split('-')[-2]}.jpg"
    s3_client.upload_fileobj(temp, BUCKET_NAME, new_name, ExtraArgs={'ACL': 'public-read', 'ContentType': 'image/jpeg'})
    avatar_url = f"{BUCKET_URL_PREFIX}/{new_name}"
    dynamodb_client.update_item(
        TableName=USERS_TABLE_NAME,
        Key={'userId': {"S": profile_id}},
        AttributeUpdates={
            'avatar': {
                'Value': {"S": avatar_url},
                'Action': 'PUT',
            }
        }
    )
    if key_to_delete:
        s3_client.delete_object(
            Bucket=BUCKET_NAME,
            Key=key_to_delete,
        )
    lambda_client.invoke(
        FunctionName=UPDATE_PROFILE_INFO_IN_CREATED_IDEAS_FUNCTION_NAME,
        InvocationType='Event',
        LogType='Tail',
        Payload=json.dumps({'userId': profile_id, 'authorAvatar': avatar_url}),
    )

    return {'result': {'ok': True, }, 'avatar': avatar_url}
