from datetime import date, datetime
from datetime import timedelta

from utils.common import progressive_chunks, SEND_BATCH_EMAIL_CHUNK_SIZE
from utils.models import UserModel, IdeaModel

from mail_templates.weekly_digest.send_weekly_digest import bulk_send_weekly_digest
from raven import Client # Offical `raven` module
from raven_python_lambda import RavenLambdaWrapper

def get_mails_to_send():
    today = datetime.now()
    for user in UserModel.scan((UserModel.firstLogin == True) & (UserModel.userId == '9229eeeb-4b8d-4c72-b938-260f87968461')):
        week_ago = today - timedelta(weeks=1)
        ideas_last_week = IdeaModel.usersIdeasByDateIndex.query(user.userId, (IdeaModel.createdDate > week_ago),
                                                                limit=100, scan_index_forward=False)
        yield (user, list(ideas_last_week))

@RavenLambdaWrapper()
def handler(event, context):
    for chunk_to_send in progressive_chunks(get_mails_to_send(), SEND_BATCH_EMAIL_CHUNK_SIZE):
        bulk_send_weekly_digest(chunk_to_send)
