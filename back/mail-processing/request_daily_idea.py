# from datetime import date
# import logging
from utils.common import progressive_chunks, SEND_BATCH_EMAIL_CHUNK_SIZE
from utils.models import UserModel
from mail_templates.request_daily_idea.send_request_daily import send_daily_bulk
import datetime
from raven import Client # Offical `raven` module
from raven_python_lambda import RavenLambdaWrapper

# logger = logging.getLogger()
# logger.setLevel(logging.INFO)

@RavenLambdaWrapper()
def endpoint(event, context):
    now = datetime.datetime.now()
    users_iterator = UserModel.scan(
        (UserModel.firstLogin == True) & (UserModel.ideaReminders == True) & (
                    (~UserModel.snoozeEmails.is_type()) | (UserModel.snoozeEmails < now)),
        page_size=SEND_BATCH_EMAIL_CHUNK_SIZE,
        attributes_to_get=['name', 'email', 'userId', 'emailToken'])
    for chunk_to_send in progressive_chunks(users_iterator, SEND_BATCH_EMAIL_CHUNK_SIZE):
        send_daily_bulk(chunk_to_send)
#
# if __name__ == '__main__':
#     endpoint('1','2')
