import os
from datetime import date
import json
import boto3

AWS_REGION = os.environ['SES_AWS_REGION']
MAILBOX_ADDR = os.environ['MAILBOX_ADDR']

SENDER = f"Daily Idea <{MAILBOX_ADDR}>"


def send_daily_bulk(users_list):
    REQUEST_DAILY_EMAIL_TEMPLATE_NAME = os.environ.get('REQUEST_DAILY_EMAIL_TEMPLATE_NAME')
    BUCKET_URL_PREFIX = os.environ.get('BUCKET_URL_PREFIX')
    DOMAIN_NAME = os.environ.get('DOMAIN_NAME')
    TODAY = date.today().strftime('%a %b %d %Y')
    client = boto3.client('ses', region_name=AWS_REGION)
    client.send_bulk_templated_email(
            Source=SENDER,
            Template=REQUEST_DAILY_EMAIL_TEMPLATE_NAME,
            DefaultTemplateData=json.dumps(
                {"BUCKET_URL_PREFIX": BUCKET_URL_PREFIX, "DOMAIN_NAME": DOMAIN_NAME, "TODAY": TODAY, }),
            Destinations=[
                {
                    'Destination': {
                        'ToAddresses': [
                            user.email,
                        ],
                    },
                    'ReplacementTemplateData': json.dumps(
                        {"USERNAME": user.name})
                } for user in users_list
            ]
        )
