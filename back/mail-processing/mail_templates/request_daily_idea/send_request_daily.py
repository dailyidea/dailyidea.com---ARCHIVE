import os
import random
from datetime import date
import json
import boto3

from quotes_list import quotes_list

AWS_REGION = os.environ['SES_AWS_REGION']
MAILBOX_ADDR = os.environ['MAILBOX_ADDR']

SENDER = f"Daily Idea <{MAILBOX_ADDR}>"

def get_random_quote():
    return random.choice(quotes_list)

def send_daily_bulk(users_list):
    REQUEST_DAILY_EMAIL_TEMPLATE_NAME = os.environ.get('REQUEST_DAILY_EMAIL_TEMPLATE_NAME')
    BUCKET_URL_PREFIX = os.environ.get('BUCKET_URL_PREFIX')
    DOMAIN_NAME = os.environ.get('DOMAIN_NAME')
    TODAY = date.today().strftime('%a %b %d %Y')
    
    destinations = []

    for user in users_list:
        quote = get_random_quote()

        destinations.append({
            'Destination': {
                'ToAddresses': [
                    user.email,
                ],
            },
            'ReplacementTemplateData': json.dumps(
                {
                    "USERNAME": user.name,
                    "USER_ID": user.userId,
                    "SNOOZE_TOKEN": user.emailToken,
                    "QUOTE":quote['quote'],
                    "QUOTE_BY":quote['by']
                }
            )
        })

    
    
    client = boto3.client('ses', region_name=AWS_REGION)
    client.send_bulk_templated_email(
            Source=SENDER,
            Template=REQUEST_DAILY_EMAIL_TEMPLATE_NAME,
            DefaultTemplateData=json.dumps(
                {"BUCKET_URL_PREFIX": BUCKET_URL_PREFIX, "DOMAIN_NAME": DOMAIN_NAME, "TODAY": TODAY, }),
            Destinations=destinations 
    )
