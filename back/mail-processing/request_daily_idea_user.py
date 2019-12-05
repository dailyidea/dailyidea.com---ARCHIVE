from datetime import date

from utils.models import UserModel
from mail_templates.request_daily_idea.send_request_daily import send_daily



def endpoint(event, context):
    user = list(UserModel.emailIndex.query(event.get('email')))
    send_daily(user[0])
#
# if __name__ == '__main__':
#     endpoint('1','2')
