import boto3
import os
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

sentry_sdk.init(dsn=os.environ.get("SENTRY_DSN"), integrations=[AwsLambdaIntegration()])

client = boto3.client("dynamodb", region_name="us-east-1")

USERS_TABLE_NAME = os.environ.get("USERS_TABLE_NAME")
COMMENTS_TABLE_NAME = os.environ.get("COMMENTS_TABLE_NAME")

MAX_LIMIT = 100
DEFAULT_LIMIT = 25

def endpoint(event, context):
    ctx = event["ctx"]
    arguments = ctx["arguments"]
    ideaId = arguments['ideaId']
    nextToken = arguments.get("nextToken")
    limit = arguments.get("limit", DEFAULT_LIMIT)

    if limit > MAX_LIMIT:
        limit = MAX_LIMIT

    extraKeys = {}

    if nextToken:
        extraKeys['ExclusiveStartKey'] = {
            "ideaId": {"S": nextToken },
        }

    comments = client.query(
        TableName=COMMENTS_TABLE_NAME,
        KeyConditionExpression="ideaId = :ideaId",
        ExpressionAttributeValues={
            ":ideaId": {
                "S": ideaId,
            }
        },
        Limit=limit,
        IndexName="byDateIndex",
        ScanIndexForward=False,
        **extraKeys
    )

    results = []

    for comment in comments['Items']:
        for key in comment:
            comment[key] = comment[key]['S']

        user = client.query(
            TableName=USERS_TABLE_NAME,
            KeyConditionExpression="userId = :userId",
            ExpressionAttributeValues={
               ':userId': {"S": comment['userId']}
            },
        )

        if user and user['Items']:
            avatar = user['Items'][0]['avatar']['S']
            comment['userAvatar'] = avatar 

        results.append(comment)

    return {
        "items": results,
        "nextToken": comments.get("nextToken"), 
    }
