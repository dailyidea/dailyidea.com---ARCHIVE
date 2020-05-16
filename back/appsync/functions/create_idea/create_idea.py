import boto3
import logging

import uuid
import datetime
import os

from ..utils.common_db_utils import chunks, BATCH_WRITE_CHUNK_SIZE
from ..utils.idea_utils import sanitize_idea_content, prepare_idea_tags_for_put_request
from raven import Client # Offical `raven` module
from raven_python_lambda import RavenLambdaWrapper

# logger = logging.getLogger()
# logger.setLevel(logging.INFO)

@RavenLambdaWrapper()
def endpoint(event, lambda_context):
    ctx = event.get('ctx')
    arguments = ctx.get('arguments')
    title = arguments.get('title')
    content = sanitize_idea_content(arguments.get('content', None))
    tags = arguments.get('tags', list())
    image_attachments = arguments.get('imageAttachments', list())
    file_attachments = arguments.get('fileAttachments', list())
    if len(tags) > 100:
        raise Exception('Too much tags')
    is_private = arguments.get('isPrivate', False)

    client = boto3.client('dynamodb', region_name='us-east-1')
    idea_id = str(uuid.uuid4())
    creator_id = ctx.get('identity').get('username')

    creator_account = client.get_item(
        TableName=os.environ.get('USERS_TABLE_NAME'),
        Key={'userId': {"S": creator_id}},
    )['Item']
    creator_name_raw = creator_account.get('name', None)
    creator_slug = creator_account.get('slug').get('S')
    creator_avatar = creator_account.get('avatar').get('S') if creator_account.get('avatar') else None
    creator_name = creator_name_raw.get('S') if creator_name_raw else 'Anonymous User'

    client.put_item(
        TableName=os.environ.get('IDEAS_TABLE_NAME'),
        Item={
            'sortKey': {"S": 'idea'},
            'ideaId': {"S": idea_id},
            'userId': {"S": creator_id},
            "title": {"S": title},
            "content": {"S": content} if content else {"NULL": True},
            "ideaDate": {"S": datetime.datetime.now().isoformat()},
            "createdDate": {"S": datetime.datetime.now().isoformat()},
            "likesCount": {"N": "0"},
            "commentsCount": {"N": "0"},
            "authorName": {"S": creator_name},
            "authorSlug": {"S": creator_slug},
            "authorAvatar": {"S": creator_avatar} if creator_avatar else {"NULL": True},
            "visibility": {"S": "PRIVATE" if is_private else "PUBLIC"},
            "imageAttachments": {"SS": image_attachments} if len(image_attachments) else {"NULL": True},
            "fileAttachments": {"SS": file_attachments} if len(image_attachments) else {"NULL": True},
            "previewImage": {"S": image_attachments[0]} if len(image_attachments) else {"NULL": True},
        })
    client.update_item(
        TableName=os.environ.get('USERS_TABLE_NAME'),
        Key={'userId': {"S": creator_id}},
        UpdateExpression="ADD #ideascreatedfield :plusOne",
        ExpressionAttributeNames={"#ideascreatedfield": 'ideasCreated'},
        ExpressionAttributeValues={":plusOne": {"N": '1'}},
    )
    if len(tags):
        prepared_tags = prepare_idea_tags_for_put_request(tags, creator_id, idea_id)
        for tags_chunk in chunks(prepared_tags, BATCH_WRITE_CHUNK_SIZE):
            client.batch_write_item(
                RequestItems={
                    os.environ.get('TAGS_TABLE_NAME'): tags_chunk
                }
            )

    return {'ideaId': idea_id}
