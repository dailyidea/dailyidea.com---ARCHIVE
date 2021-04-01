import os
import random
from datetime import date, datetime, timedelta
import json
import boto3
import jwt
import urllib.parse
from utils.models import IdeaModel, UserModel
from dateutil.parser import parse

AWS_REGION = os.getenv('SES_AWS_REGION', 'us-east-1')
MAILBOX_ADDR = os.getenv('MAILBOX_ADDR', 'ideas-dev@beta.dailyidea.com')

SENDER = f"Daily Idea <{MAILBOX_ADDR}>"

WEEK_AGO = (datetime.now() - timedelta(days=7)).isoformat()

client = boto3.client('dynamodb', region_name='us-east-1')

def get_user(user_id):
  return UserModel.get(user_id)

def send_idea_notifications_bulk(users_list):
    IDEA_NOTIFICATIONS_TEMPLATE_NAME = os.getenv('IDEA_NOTIFICATIONS_TEMPLATE_NAME', 'ideaNotifcationsEmailTemplate-dev')
    BUCKET_URL_PREFIX = os.getenv('BUCKET_URL_PREFIX')
    DOMAIN_NAME = os.getenv('DOMAIN_NAME')
    SECRET_TOKEN = os.getenv('SECRET_TOKEN', 'secret-tk1x')
    TODAY = date.today().strftime('%a %b %d %Y')

    destinations = []

    for user_id, ideas in users_list.items():
        user = get_user(user_id)

        if (user.unsubscribedAt): continue
        if (not user.ideaActivity): continue
        if (user.snoozeEmails and user.snoozeEmails > datetime.utcnow()): continue

        print(user.email)

        ideasNames = ''
        ideasList = list(ideas.values())

        if (len(ideasList) > 1):
            for idea in ideasList[:-1]:
                if (ideasNames): ideasNames = ideasNames + ', '
                ideasNames = ideasNames + '"' + idea['idea']['title'] + '"'
            ideasNames = ideasNames + ' and ' + '"' + ideasList[len(ideasList) - 1]['idea']['title'] + '"'
        else:
            ideasNames = '"' + ideasList[0]['idea']['title'] + '"'

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
                    "AUTH_TOKEN": jwt.encode({'email': user.email, 'exp': (datetime.utcnow() + timedelta(days=7))}, SECRET_TOKEN).decode('utf-8'),
                    "EMAIL": urllib.parse.quote(user.email),
                    "IDEAS": ideas,
                    "IDEAS_NAMES": ideasNames,
                }
            )
        })

    if (len(destinations) == 0): return

    client = boto3.client('ses', region_name=AWS_REGION)
    client.send_bulk_templated_email(
            Source=SENDER,
            Template=IDEA_NOTIFICATIONS_TEMPLATE_NAME,
            DefaultTemplateData=json.dumps(
                {"BUCKET_URL_PREFIX": BUCKET_URL_PREFIX, "DOMAIN_NAME": DOMAIN_NAME, "TODAY": TODAY, }),
            Destinations=destinations
    )
