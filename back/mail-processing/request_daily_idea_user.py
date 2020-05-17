from datetime import date

from utils.models import UserModel
from mail_templates.request_daily_idea.send_request_daily import send_daily_bulk
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

sentry_sdk.init(dsn=os.environ.get('SENTRY_DSN'), integrations=[AwsLambdaIntegration()])

def endpoint(event, context):
    users_list = list(UserModel.emailIndex.query(event.get('email')))
    send_daily_bulk(users_list)
#
# if __name__ == '__main__':
#     endpoint('1','2')
