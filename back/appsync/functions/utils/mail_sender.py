import os

import boto3
from botocore.exceptions import ClientError

AWS_REGION = os.getenv('SES_AWS_REGION')
MAILBOX_ADDR = os.getenv('MAILBOX_ADDR', 'ideas-dev@beta.dailyidea.com')

SENDER = f"Daily Idea <{MAILBOX_ADDR}>"


def send_mail_to_user(recepient, subject, body_text, body_html):
    client = boto3.client('ses', region_name=AWS_REGION)
    body = {}
    if body_html:
        body['Html'] = {
            'Charset': 'UTF-8',
            'Data': body_html,
        }
    if body_text:
        body['Text'] = {
            'Charset': 'UTF-8',
            'Data': body_text,
        }

    try:
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    recepient,
                ],
            },
            Message={
                'Body': body,
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': subject,
                },
            },
            Source=SENDER,
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])
