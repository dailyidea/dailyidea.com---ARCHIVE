from datetime import date, datetime
from datetime import timedelta

from utils.common import progressive_chunks, SEND_BATCH_EMAIL_CHUNK_SIZE
from utils.models import UserModel, IdeaModel

from mail_templates.weekly_digest.send_weekly_digest import bulk_send_weekly_digest
import os
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

sentry_sdk.init(dsn=os.environ.get('SENTRY_DSN'), integrations=[AwsLambdaIntegration()])

def get_mails_to_send():
    today = datetime.now()
    for user in UserModel.scan(
        (UserModel.firstLogin == True) 
        & (UserModel.weeklyDigests == True) 
        & (UserModel.unsubscribedAt.does_not_exist() | (UserModel.unsubscribedAt.exists() & ~UserModel.unsubscribedAt.is_type()))
        ,
        attributes_to_get=['name', 'email', 'userId', 'emailToken']
    ):

        week_ago = today - timedelta(weeks=1)
        ideas_last_week = IdeaModel.usersIdeasByDateIndex.query(user.userId, (IdeaModel.createdDate > week_ago),
                                                                limit=100, scan_index_forward=False)
        yield (user, list(ideas_last_week))

def endpoint(event, context):
    for chunk_to_send in progressive_chunks(get_mails_to_send(), SEND_BATCH_EMAIL_CHUNK_SIZE):
        bulk_send_weekly_digest(chunk_to_send)
