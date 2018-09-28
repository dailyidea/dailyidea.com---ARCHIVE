import os
import boto3
from botocore.exceptions import ClientError
from datetime import datetime
from models import IdeaModel, UserModel
# Replace sender@example.com with your "From" address.
# This address must be verified with Amazon SES.
SENDER = "Sender Name <sender@example.com>"


AWS_REGION = '1' or os.environ['SES_AWS_REGION']

SUBJECT = f"Daily Idea for {datetime.now().isoformat()}"

BODY_TEXT = ("Reply to this mail with your daily idea. TODO PROPER TEXT"
             )

BODY_HTML = """<html>
<head></head>
<body>
  <p> Reply to this mail with your daily idea. TODO PROPER TEXT</p>
</body>
</html>
"""


def notify_user(recepient):
    # Create a new SES resource and specify a region.
    client = boto3.client('ses', region_name=AWS_REGION)

    # Try to send the email.
    try:
        # Provide the contents of the email.
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    recepient,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': 'UTF-8',
                        'Data': BODY_HTML,
                    },
                    'Text': {
                        'Charset': 'UTF-8',
                        'Data': BODY_TEXT,
                    },
                },
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': SUBJECT,
                },
            },
            Source=SENDER,
            # If you are not using a configuration set, comment or delete the
            # following line
        )
    # Display an error if something goes wrong.
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])


def endpoint(event, context):
    today = datetime.today().weekday()
    for user in UserModel.scan():
        if str(today) in user.ideasMailSchedule:
            notify_user(user.email)
            # print(user.email)
#
# if __name__ == '__main__':
#     endpoint('1','2')
