import os
import random
from datetime import date, datetime, timedelta
import json
import boto3
import jwt
import urllib.parse
from common.utils.get_quote import get_quote

AWS_REGION = os.getenv('SES_AWS_REGION', 'us-east-1')
MAILBOX_ADDR = os.getenv('MAILBOX_ADDR', 'ideas-dev@beta.dailyidea.com')

SENDER = f"Daily Idea <{MAILBOX_ADDR}>"

def send_daily_bulk(users_list):
    REQUEST_DAILY_EMAIL_TEMPLATE_NAME = os.getenv('REQUEST_DAILY_EMAIL_TEMPLATE_NAME', 'requestDailyIdeaEmailTemplate-dev')
    BUCKET_URL_PREFIX = os.getenv('BUCKET_URL_PREFIX')
    DOMAIN_NAME = os.getenv('DOMAIN_NAME')
    SECRET_TOKEN = os.getenv('SECRET_TOKEN', 'secret-tk1x')
    TODAY = date.today().strftime('%a %b %d %Y')
    
    destinations = []
    quote = get_quote()

    for user in users_list:
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
                    "QUOTE_BY":quote['author'],
                    "AUTH_TOKEN": jwt.encode({'email': user.email, 'exp': (datetime.utcnow() + timedelta(days=7))}, SECRET_TOKEN).decode('utf-8'),
                    "EMAIL": urllib.parse.quote(user.email),
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
