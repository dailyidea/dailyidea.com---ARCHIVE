import boto3
import uuid
import datetime
import os
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

sentry_sdk.init(dsn=os.environ.get('SENTRY_DSN'), integrations=[AwsLambdaIntegration()])

client = boto3.client('dynamodb', region_name='us-east-1')

def endpoint(event, lambda_context):
    ctx = event.get('ctx')
    arguments = ctx.get('arguments')
    user_id = arguments.get('userId')
    token = arguments.get('token')
    resp = client.query(
        TableName=os.environ.get('USERS_TABLE_NAME'),
        KeyConditionExpression='userId=:userId',
        ExpressionAttributeValues={
            ":userId": {"S": user_id}
        }
    )
    if not resp.get('Items') or len(resp.get('Items')) < 1:
        return {'ok': False, 'error': 'User not Found'}
    user = resp.get('Items')[0]
    if user['emailToken']['S'] != token:
        return {'ok': False, 'error': 'Incorrect Token'}

    client.update_item(
        TableName=os.environ.get('USERS_TABLE_NAME'),
        Key={'userId': {"S": user_id}},
        AttributeUpdates={
            "unsubscribedAt": {
                'Value': {'S': datetime.datetime.today().isoformat()},
                'Action': 'PUT',
            },
        }
    )

    return {'ok': True, 'userName': user['name']['S']}
