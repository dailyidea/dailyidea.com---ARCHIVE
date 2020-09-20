import boto3
import os
from common.utils.idea_utils import strip_html

def endpoint(event, lambda_context):
    client = boto3.client('dynamodb', region_name='us-east-1')

    response = client.scan(
        TableName=os.environ.get('IDEAS_TABLE_NAME', 'dailyidea-ideas-dev'),
        FilterExpression="attribute_not_exists(strippedContent)",
    )

    num_updated = 0

    for idea in response['Items']:
        content = idea.get('content', {}).get('S')

        if not content:
            continue

        num_updated += 1
        stripped_content = strip_html(content)
        client.update_item(
            TableName=os.environ.get('IDEAS_TABLE_NAME', 'dailyidea-ideas-dev'),
            Key={
                'ideaId': {'S': idea['ideaId']['S']},
                'userId': {'S': idea['userId']['S']}
            },
            UpdateExpression='SET strippedContent = :strippedContent',
            ExpressionAttributeValues={
                ':strippedContent': {'S': stripped_content}
            }
        )

    print("UPDATED", num_updated)

    return {}
