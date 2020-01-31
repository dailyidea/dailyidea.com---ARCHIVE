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


def update_user_info_in_ideas(user_id, ideas_id_list, name=None, slug=None, avatar=None):
    expression = "SET"
    attribute_values = {}

    if name:
        expression += ' authorName=:authorName,'
        attribute_values[':authorName'] = {"S": name}
    if slug:
        expression += ' authorSlug=:authorSlug,'
        attribute_values[':authorSlug'] = {"S": slug}
    if avatar:
        expression += ' authorAvatar=:authorAvatar,'
        attribute_values[':authorAvatar'] = {"S": avatar}
    assert len(expression) > 3
    expression = expression[:-1]  # remove last comma
    for idea_id in ideas_id_list:
        dynamodb.update_item(
            TableName=IDEAS_TABLE_NAME,
            Key={
                "userId": {'S': user_id},
                'ideaId': {'S': idea_id}
            },
            UpdateExpression=expression,
            ExpressionAttributeValues=attribute_values
        )


def endpoint(payload, lambda_context):
    user_name = payload.get('authorName')
    user_id = payload.get('userId')
    user_slug = payload.get('authorSlug')
    user_avatar = payload.get('authorAvatar')
    assert user_id is not None
    assert (user_name and user_slug) or user_avatar
    users_ideas_id_list = get_all_users_ideas_id_list(user_id)
    update_user_info_in_ideas(user_id, users_ideas_id_list, user_name, user_slug, user_avatar)
