import boto3
import os
from slugify import slugify
from ..utils.idea_utils import generate_short_id

def endpoint(event, lambda_context):
    client = boto3.client('dynamodb', region_name='us-east-1')

    response = client.scan(
        TableName='dailyidea-ideas-dev',
        FilterExpression="attribute_not_exists(shortId)",
    )

    print(response['Items'])

    client.update_item(
        TableName=os.environ.get('IDEAS_TABLE_NAME'),
        Key={
            'ideaId': {"S": idea_id},
            'userId': {"S": idea_owner_id}
        },
        UpdateExpression='SET title = :title, slug = :slug, content = :content, updatedDate = :updatedDate, fileAttachments=:fileAttachments, imageAttachments=:imageAttachments, previewImage=:previewImage',
        ExpressionAttributeValues={
            ":title": {"S": title},
            ":slug": {"S": slug},
            ":content": {"S": content} if content else {"NULL": True},
            ":updatedDate": {"S": datetime.datetime.now().isoformat()},
            ":fileAttachments": {"SS": new_file_attachments} if len(new_file_attachments) else {"NULL": True},
            ":imageAttachments": {"SS": new_image_attachments} if len(new_image_attachments) else {"NULL": True},
            ":previewImage": {"S": new_image_attachments[0]} if len(new_image_attachments) else {"NULL": True},
        }
    )

    return {}
