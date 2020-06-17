import boto3
import os
import datetime
from ..utils.models import UserModel
from ..utils.common import progressive_chunks, SEND_BATCH_EMAIL_CHUNK_SIZE
from ..utils.mail_sender import send_mail_to_user
import os
import json
import urllib.parse
from jinja2 import Template
from pathlib import Path

import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

sentry_sdk.init(dsn=os.getenv('SENTRY_DSN'), integrations=[AwsLambdaIntegration()])

AWS_REGION = os.getenv('SES_AWS_REGION')

def send_digest_bulk(users_list, ideas):
    destinations = []

    template = Template(Path('functions/send_digest/digest.html').read_text())

    for user in users_list:
        print(user.email)
        send_mail_to_user(user.email, 'Ideas Digest', '', template.render(ideas=ideas, user=user))


def endpoint(event, lambda_context):
    ctx = event.get('ctx')
    arguments = ctx.get('arguments')
    idea_ids = arguments.get('ideaIds')
    passcode = arguments.get('passcode')
    assert passcode == os.getenv('DIGEST_PASSCODE')

    client = boto3.client('dynamodb', region_name=AWS_REGION)

    ideas = []
    for idea_id in idea_ids:
        resp = client.query(
            TableName=os.getenv('IDEAS_TABLE_NAME', 'dailyidea-ideas-dev'),
            IndexName="ideasById",
            KeyConditionExpression='ideaId=:ideaId',
            ExpressionAttributeValues={
                ":ideaId": {"S": idea_id}
            }
        )
        ideas.append(resp['Items'][0])

    print(ideas)

    now = datetime.datetime.now()
    users_iterator = UserModel.scan(
        (UserModel.firstLogin == True) & (UserModel.ideaReminders == True) & (
                    (~UserModel.snoozeEmails.is_type()) | (UserModel.snoozeEmails < now)),
        page_size=SEND_BATCH_EMAIL_CHUNK_SIZE,
        attributes_to_get=['name', 'email', 'userId', 'emailToken'])
    for chunk_to_send in progressive_chunks(users_iterator, SEND_BATCH_EMAIL_CHUNK_SIZE):
        send_digest_bulk(chunk_to_send, ideas)

    return {'ok': True}
