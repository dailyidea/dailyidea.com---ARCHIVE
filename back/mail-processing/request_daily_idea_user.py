from datetime import date

from utils.models import UserModel
from mail_template.sed_request_daily import send_daily



def endpoint(event, context):
    user = UserModel.emailIndex.query(event.email)
    send_daily(user)
#
# if __name__ == '__main__':
#     endpoint('1','2')
