import boto3
import os

dynamodb = boto3.client('dynamodb', region_name='us-east-1')
IDEAS_TABLE_NAME = os.environ.get('IDEAS_TABLE_NAME')


def scan(user_id, from_key=None):
    kwargs = {}
    if from_key:
        kwargs['ExclusiveStartKey'] = from_key
    response = dynamodb.query(
        TableName=IDEAS_TABLE_NAME,
        KeyConditionExpression='userId=:userId',
        ExpressionAttributeValues={
            ":userId": {
                "S": user_id
            }
        },
        Limit=100,
        ProjectionExpression="ideaId",
        **kwargs
    )
    return response


def get_all_users_ideas_id_list(user_id):
    all_items = []
    i = 0
    last_key = None
    while True:
        response = scan(user_id=user_id, from_key=last_key)
        last_key = response.get('LastEvaluatedKey', None)
        all_items.extend(map(lambda r: r.get('ideaId').get('S'), response['Items']))
        if last_key is None:
            break
        i += 1
    return all_items


def update_user_info_in_ideas(user_id, ideas_id_list, name, slug):
    for idea_id in ideas_id_list:
        dynamodb.update_item(
            TableName=IDEAS_TABLE_NAME,
            Key={
                "userId": {'S': user_id},
                'ideaId': {'S': idea_id}
            },
            UpdateExpression="SET authorName=:authorName, authorSlug=:authorSlug",
            ExpressionAttributeValues={
                ":authorName": {
                    "S": name
                },
                ":authorSlug": {
                    "S": slug
                },
            }
        )


def endpoint(payload, lambda_context):
    user_name = payload.get('userName')
    user_id = payload.get('userId')
    user_slug = payload.get('userSlug')
    assert user_name and user_slug and user_id and len(user_name) >= 3
    users_ideas_id_list = get_all_users_ideas_id_list(user_id)
    update_user_info_in_ideas(user_id, users_ideas_id_list, user_name, user_slug)
