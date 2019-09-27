import json
import logging
import boto3
from ..json_util import loads as dynamo_loads
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def endpoint(event, context):
    client = boto3.client('dynamodb', region_name='us-east-1')
    userId = event['identity']['username']
    offset = 0
    limit = 100
    resp = client.query(
        TableName='dailyidea-likes-dev',
        KeyConditionExpression="userId = :userId",
        IndexName='userLikes',
        ExpressionAttributeValues={":userId": {"S": userId}},
        ProjectionExpression='ideaId,ideaOwnerId'
    )

    ideas_keys = resp["Items"]
    total_count = len(ideas_keys)
    if len(ideas_keys) == 0:
        return {'items': [], 'count': 0}
    ideas_keys = ideas_keys[offset:limit]
    ideas = client.batch_get_item(
        RequestItems={
            'dailyidea-ideas-dev': {
                'Keys': list(map(lambda key: {'ideaId': key['ideaId'], 'userId': key['ideaOwnerId']}, ideas_keys)),
                'ConsistentRead': True,
            }
        }
    )
    raw_ideas = ideas['Responses']['dailyidea-ideas-dev']
    clean_ideas = dynamo_loads(raw_ideas)
    logger.info(clean_ideas)
    return {'items': clean_ideas, 'count': total_count}
