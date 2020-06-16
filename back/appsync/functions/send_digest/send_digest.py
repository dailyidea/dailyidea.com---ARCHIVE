import boto3
import os
#import sentry_sdk
#from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

#sentry_sdk.init(dsn=os.environ.get('SENTRY_DSN'), integrations=[AwsLambdaIntegration()])

client = boto3.client('dynamodb', region_name='us-east-1')

os.environ['IDEAS_TABLE_NAME'] = 'dailyidea-ideas-dev' # Remove

def endpoint(event, lambda_context):
    ctx = event.get('ctx')
    arguments = ctx.get('arguments')
    idea_ids = arguments.get('ideaIds')
    passcode = arguments.get('passcode')
    assert passcode == os.environ.get('DIGEST_PASSCODE')

    ideas = []
    for idea_id in idea_ids:
        resp = client.query(
            TableName=os.environ.get('IDEAS_TABLE_NAME'),
            IndexName="ideasById",
            KeyConditionExpression='ideaId=:ideaId',
            ExpressionAttributeValues={
                ":ideaId": {"S": idea_id}
            }
        )
        ideas.append(resp['Items'][0])

    # TOOD send emails to all users

    print(ideas)

    return {'ok': True}
