# from datetime import date
# import logging
from utils.common import progressive_chunks, SEND_BATCH_EMAIL_CHUNK_SIZE
from utils.models import UserModel
from mail_templates.request_daily_idea.send_request_daily import send_daily_bulk
import datetime
import os
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

sentry_sdk.init(dsn=os.getenv('SENTRY_DSN'), integrations=[AwsLambdaIntegration()])

# logger = logging.getLogger()
# logger.setLevel(logging.INFO)

def endpoint(event, context):
    now = datetime.datetime.now()
    users_iterator = UserModel.scan(
        (UserModel.firstLogin == True) & UserModel.unsubscribedAt.does_not_exist() & (UserModel.weeklyDigests == True) & (
                    (~UserModel.snoozeEmails.is_type()) | (UserModel.snoozeEmails < now)),
        page_size=SEND_BATCH_EMAIL_CHUNK_SIZE,
        attributes_to_get=['name', 'email', 'userId', 'emailToken'])
    for chunk_to_send in progressive_chunks(users_iterator, SEND_BATCH_EMAIL_CHUNK_SIZE):
        send_daily_bulk(chunk_to_send)
#
# if __name__ == '__main__':
#     endpoint('1','2')
