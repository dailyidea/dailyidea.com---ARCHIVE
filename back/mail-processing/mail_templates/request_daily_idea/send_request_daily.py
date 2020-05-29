import os
import random
from datetime import date, datetime, timedelta
import json
import boto3
import jwt
import urllib.parse
from utils.generate_quote import GenerateQuote

AWS_REGION = os.environ['SES_AWS_REGION']
MAILBOX_ADDR = os.environ['MAILBOX_ADDR']

SENDER = f"Daily Idea <{MAILBOX_ADDR}>"

def send_daily_bulk(users_list):
    REQUEST_DAILY_EMAIL_TEMPLATE_NAME = os.environ.get('REQUEST_DAILY_EMAIL_TEMPLATE_NAME')
    BUCKET_URL_PREFIX = os.environ.get('BUCKET_URL_PREFIX')
    DOMAIN_NAME = os.environ.get('DOMAIN_NAME')
    SECRET_TOKEN = os.environ.get('SECRET_TOKEN')
    TODAY = date.today().strftime('%a %b %d %Y')
    
    destinations = []
    
    quote_gen = GenerateQuote()
    quote = quote_gen.get_todays_quote()

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
                    "QUOTE_BY":quote['by'],
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
