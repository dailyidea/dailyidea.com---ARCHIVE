import boto3
import os
from slugify import slugify
from common.utils.idea_utils import generate_short_id

def endpoint(event, lambda_context):
    client = boto3.client('dynamodb', region_name='us-east-1')

    response = client.scan(
        TableName=os.environ.get('IDEAS_TABLE_NAME', 'dailyidea-ideas-dev'),
        FilterExpression="attribute_not_exists(shortId)",
    )

    for idea in response['Items']:
        slug = slugify(idea['title']['S'])
        client.update_item(
            TableName=os.environ.get('IDEAS_TABLE_NAME', 'dailyidea-ideas-dev'),
            Key={
                'ideaId': {'S': idea['ideaId']['S']},
                'userId': {'S': idea['userId']['S']}
            },
            UpdateExpression='SET shortId = :shortId, slug = :slug',
            ExpressionAttributeValues={
                ":shortId": {'S': generate_short_id()},
                ":slug": {'S': slug},
            }
        )
        print(slug)

    return {}
