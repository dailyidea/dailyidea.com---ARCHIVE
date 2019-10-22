from datetime import date

from utils.models import UserModel
from mail_templates.request_daily_idea.send_request_daily import send_daily



def endpoint(event, context):
    today = date.today().weekday()
    for user in UserModel.scan():
        if str(today) in user.ideasMailSchedule:
            send_daily(user)
#
# if __name__ == '__main__':
#     endpoint('1','2')
