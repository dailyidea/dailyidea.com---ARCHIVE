import os
import random
from datetime import date, datetime, timedelta
import json
import boto3
import jwt
import urllib.parse
from utils.generate_quote import GenerateQuote

AWS_REGION = os.getenv('SES_AWS_REGION', 'us-east-1')
MAILBOX_ADDR = os.getenv('MAILBOX_ADDR', 'ideas-dev@beta.dailyidea.com')

SENDER = f"Daily Idea <{MAILBOX_ADDR}>"

WEEK_AGO = (datetime.now() - timedelta(days=7)).isoformat()

client = boto3.client('dynamodb', region_name='us-east-1')

def get_ideas_count(user_id):
    resp = client.query(
        TableName=os.getenv('IDEAS_TABLE_NAME', 'dailyidea-ideas-dev'),
        IndexName='myIdeasByDate',
        KeyConditionExpression='userId = :userId AND createdDate >= :weekAgo',
        ExpressionAttributeValues={
            ':userId': {"S": user_id},
            ':weekAgo': {"S": WEEK_AGO},
        },
        ScanIndexForward=False,
        Select='COUNT',
    )

    return resp['Count']

def get_saves_count(user_id):
    resp = client.query(
        TableName=os.getenv('SAVES_TABLE_NAME', 'dailyidea-saves-dev'),
        IndexName='ownerSavesByDate',
        KeyConditionExpression='ideaOwnerId = :userId AND savedTime >= :weekAgo',
        ExpressionAttributeValues={
            ':userId': {"S": user_id},
            ':weekAgo': {"S": WEEK_AGO},
        },
        ScanIndexForward=False,
        Select='COUNT',
    )

    return resp['Count']

def get_shares_count(user_id):
    resp = client.query(
        TableName=os.getenv('STATS_ACTIONS_TABLE_NAME', 'dailyidea-stats-actions-dev'),
        IndexName='ownerStatsByDate',
        KeyConditionExpression='idea_owner_id = :userId AND createdDate >= :weekAgo',
        FilterExpression='actionType = :actionType',
        ExpressionAttributeValues={
            ':userId': {"S": user_id},
            ':weekAgo': {"S": WEEK_AGO},
            ':actionType': {"S": 'share'},
        },
        ScanIndexForward=False,
        Select='COUNT',
    )

    return resp['Count']

def get_comments_count(user_id):
    resp = client.query(
        TableName=os.getenv('COMMENTS_TABLE_NAME', 'dailyidea-comments-dev'),
        IndexName='ideaOwnerCommentsByDate',
        KeyConditionExpression='ideaOwnerId = :userId AND createdDate >= :weekAgo',
        ExpressionAttributeValues={
            ':userId': {"S": user_id},
            ':weekAgo': {"S": WEEK_AGO},
        },
        ScanIndexForward=False,
        Select='COUNT',
    )

    return resp['Count']


def send_weekly_stats_bulk(users_list):
    WEEKLY_STATS_TEMPLATE_NAME = os.getenv('WEEKLY_STATS_TEMPLATE_NAME', 'weeklyStatsEmailTemplate-dev')
    BUCKET_URL_PREFIX = os.getenv('BUCKET_URL_PREFIX')
    DOMAIN_NAME = os.getenv('DOMAIN_NAME')
    SECRET_TOKEN = os.getenv('SECRET_TOKEN', 'secret-tk1x')
    TODAY = date.today().strftime('%a %b %d %Y')

    destinations = []

    quote_gen = GenerateQuote()
    quote = quote_gen.get_todays_quote()

    for user in users_list:
        ideas_count = get_ideas_count(user.userId)
        saves_count = get_saves_count(user.userId)
        shares_coount = get_shares_count(user.userId)
        comments_count = get_comments_count(user.userId)

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
                    "IDEAS_COUNT": ideas_count,
                    "SAVES_COUNT": saves_count,
                    "SHARES_COUNT": shares_coount,
                    "COMMENTS_COUNT": comments_count,
                    "IDEAS_PLURAL": '' if ideas_count == 1 else 's',
                    "SAVES_PEOPLE": 'person' if saves_count == 1 else 'people',
                    "SHARES_PEOPLE": 'person' if shares_coount == 1 else 'people',
                    "COMMENTS_PEOPLE": 'person' if comments_count == 1 else 'people',
                }
            )
        })

    client = boto3.client('ses', region_name=AWS_REGION)
    client.send_bulk_templated_email(
            Source=SENDER,
            Template=WEEKLY_STATS_TEMPLATE_NAME,
            DefaultTemplateData=json.dumps(
                {"BUCKET_URL_PREFIX": BUCKET_URL_PREFIX, "DOMAIN_NAME": DOMAIN_NAME, "TODAY": TODAY, }),
            Destinations=destinations
    )
