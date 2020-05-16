import boto3
import uuid
import datetime
import os
from raven import Client # Offical `raven` module
from raven_python_lambda import RavenLambdaWrapper

client = boto3.client('dynamodb', region_name='us-east-1')

@RavenLambdaWrapper()
def endpoint(event, lambda_context):
    ctx = event.get('ctx')
    arguments = ctx.get('arguments')
    user_id = arguments.get('userId')
    token = arguments.get('token')
    snooze_days = arguments.get('days')
    assert snooze_days in {7, 14, 28}
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
    snooze_until = datetime.datetime.combine(
        datetime.datetime.today(),
        datetime.datetime.min.time()) + datetime.timedelta(days=snooze_days+1)
    client.update_item(
        TableName=os.environ.get('USERS_TABLE_NAME'),
        Key={'userId': {"S": user_id}},
        AttributeUpdates={
            "snoozeEmails": {
                'Value': {'S': snooze_until.isoformat()},
                'Action': 'PUT',
            },
        }
    )
    return {'ok': True}
