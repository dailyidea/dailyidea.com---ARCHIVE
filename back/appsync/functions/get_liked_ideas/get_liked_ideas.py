import logging
import boto3
from ..utils.json_util import loads as dynamo_loads
import os

logger = logging.getLogger()
logger.setLevel(logging.INFO)

DEFAULT_LIMIT = 25
MAX_LIMIT = 100


def endpoint(event, context):
    client = boto3.client('dynamodb', region_name='us-east-1')
    userId = event['identity']['username']
    current_token = event.get('nextToken', None)
    limit = event.get('limit', None)
    if limit is None or limit > MAX_LIMIT:
        limit = DEFAULT_LIMIT
    likes_query_additional_params = {}
    if current_token:
        likes_query_additional_params['ExclusiveStartKey'] = {'ideaId': {'S': current_token}, 'userId': {'S': userId}}

    resp = client.query(
        TableName=os.environ.get('LIKES_TABLE_NAME'),
        KeyConditionExpression="userId = :userId",
        IndexName='userLikesByDate',
        ExpressionAttributeValues={":userId": {"S": userId}},
        ProjectionExpression='ideaId,ideaOwnerId',
        Limit=limit,
        ScanIndexForward=False,
        **likes_query_additional_params
    )

    last_evaluated_key = resp.get('LastEvaluatedKey', None)
    next_token = None
    if last_evaluated_key:
        next_token = last_evaluated_key['ideaId']['S']  # userId is constant.

    ideas_keys = resp["Items"]
    ideas_id_list = list(map(lambda i: i['ideaId']['S'], ideas_keys))
    if len(ideas_keys) == 0:
        return {'items': [], 'nextToken': None}
    ideas = client.batch_get_item(
        RequestItems={
            os.environ.get('IDEAS_TABLE_NAME'): {
                'Keys': list(map(lambda key: {'ideaId': key['ideaId'], 'userId': key['ideaOwnerId']}, ideas_keys)),
                'ConsistentRead': True,
            }
        }
    )
    raw_ideas = ideas['Responses']['dailyidea-ideas-dev']
    clean_ideas = dynamo_loads(raw_ideas)
    clean_ideas = sorted(clean_ideas, key=lambda i: ideas_id_list.index(i['ideaId']))
    return {'items': clean_ideas, 'nextToken': next_token}
