# from datetime import date
# import logging
from utils.models import UserModel
from mail_templates.request_daily_idea.send_request_daily import send_daily_bulk


# logger = logging.getLogger()
# logger.setLevel(logging.INFO)


def endpoint(event, context):
    # today = date.today().weekday()
    send_daily_bulk(UserModel.scan(
        UserModel.firstLogin == True & UserModel.ideaReminders == True))
    # for user in UserModel.scan():
    #     if user.email:
    #         send_daily(user)
#
# if __name__ == '__main__':
#     endpoint('1','2')
