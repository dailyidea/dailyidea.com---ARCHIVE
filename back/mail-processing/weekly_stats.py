from datetime import date, datetime
from datetime import timedelta

from utils.common import progressive_chunks, SEND_BATCH_EMAIL_CHUNK_SIZE
from utils.models import UserModel, IdeaModel

from mail_templates.weekly_stats.send_weekly_stats import send_weekly_stats_bulk
import os
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

sentry_sdk.init(dsn=os.environ.get('SENTRY_DSN'), integrations=[AwsLambdaIntegration()])

import logging
logging.basicConfig()
log = logging.getLogger("pynamodb")
log.setLevel(logging.DEBUG)
log.propagate = True

def endpoint(event, context):
    now = datetime.now()
    users_iterator = UserModel.scan(UserModel.unsubscribedAt.does_not_exist() & (UserModel.weeklyDigests == True) & (
                    (~UserModel.snoozeEmails.is_type()) | (UserModel.snoozeEmails < now)),
        page_size=SEND_BATCH_EMAIL_CHUNK_SIZE,
        attributes_to_get=['name', 'email', 'userId', 'emailToken'])

    for chunk_to_send in progressive_chunks(users_iterator, SEND_BATCH_EMAIL_CHUNK_SIZE):
        send_weekly_stats_bulk(chunk_to_send)
