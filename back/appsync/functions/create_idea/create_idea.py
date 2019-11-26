import boto3
import logging
import bleach
import uuid
import datetime
import os

# logger = logging.getLogger()
# logger.setLevel(logging.INFO)


def endpoint(event, lambda_context):
    ctx = event.get('ctx')
    arguments = ctx.get('arguments')
    title = arguments.get('title')
    content = arguments.get('content', None)
    if content and len(content):
        cleaned_content = bleach.clean(content,
                                       tags=['b', 'strong', 'p', 'br', 'a', 's', 'em', 'u',
                                             'ol', 'ul', 'li',
                                             'h1', 'h2', 'h3', 'h4',
                                             'sub', 'sup',
                                             'div', 'del', 'blockquote', 'pre'],
                                       attributes={'a': ['href', 'target']}, strip_comments=False)
    tags = arguments.get('tags', list())
    is_private = arguments.get('isPrivate', False)

    client = boto3.client('dynamodb', region_name='us-east-1')
    idea_id = str(uuid.uuid4())
    creator_id = ctx.get('identity').get('username')
    client.put_item(
        TableName=os.environ.get('IDEAS_TABLE_NAME'),
        Item={
            'ideaId': {"S": idea_id},
            'userId': {"S": creator_id},
            "title": {"S": title},
            "content": {"S": cleaned_content} if (content and len(content)) else {"NULL": True},
            "ideaDate": {"S": datetime.datetime.now().isoformat()},
            "createdDate": {"S": datetime.datetime.now().isoformat()},
            "likesCount": {"N": "0"},
            "commentsCount": {"N": "0"},
            "visibility": {"S": "PRIVATE" if is_private else "PUBLIC"},
        })
    client.update_item(
        TableName=os.environ.get('USERS_TABLE_NAME'),
        Key={'userId': {"S": creator_id}},
        UpdateExpression="ADD #ideascreatedfield :plusOne",
        ExpressionAttributeNames={"#ideascreatedfield": 'ideasCreated'},
        ExpressionAttributeValues={":plusOne": {"N": '1'}},
    )
    if len(tags):
        prepared_tags = [
            {'PutRequest': {'Item': {'userId': {"S": creator_id}, "ideaId": {"S": idea_id}, "tag": {"S": tag}}}}
            for tag in tags
        ]
        client.batch_write_item(
            RequestItems={
                os.environ.get('TAGS_TABLE_NAME'): prepared_tags
            }
        )

    return {'ideaId': idea_id}
