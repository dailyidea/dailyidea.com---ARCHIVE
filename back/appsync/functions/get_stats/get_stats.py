import boto3
import os
from datetime import datetime, timedelta
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

sentry_sdk.init(dsn=os.environ.get('SENTRY_DSN'), integrations=[AwsLambdaIntegration()])

client = boto3.client('dynamodb', region_name='us-east-1')

STATS_ACTIONS_TABLE_NAME = os.environ.get('STATS_ACTIONS_TABLE_NAME')
USERS_TABLE_NAME = os.environ.get('USERS_TABLE_NAME')
IDEAS_TABLE_NAME = os.environ.get('IDEAS_TABLE_NAME')

NOW = datetime.now()
DAY_AGO = (NOW - timedelta(days=1)).isoformat()
WEEK_AGO = (NOW - timedelta(days=7)).isoformat()
MONTH_AGO = (NOW - timedelta(days=30)).isoformat()


def get_total_count(table_name):
    resp = client.describe_table(
        TableName=table_name
    )
    return resp['Table']["ItemCount"]


def scan_table_counters(table_name, sortkey_name, sortkey_value, index=None):
    all_items = []
    last_key = None

    def make_request(from_key):
        kwargs = {}
        if index:
            kwargs['IndexName'] = index
        if from_key:
            kwargs['ExclusiveStartKey'] = from_key
        resp = client.query(
            TableName=table_name,
            Limit=10000,
            ProjectionExpression='createdDate',
            KeyConditionExpression='#sortKeyName = :sortKeyValue AND createdDate >= :monthAgo',
            ExpressionAttributeValues={
                ':sortKeyValue': {"S": sortkey_value},
                ':monthAgo': {"S": MONTH_AGO}
            },
            ExpressionAttributeNames={
                '#sortKeyName': sortkey_name,
            },
            ScanIndexForward=False,
            **kwargs
        )
        return resp

    while True:
        response = make_request(last_key)
        last_key = response.get('LastEvaluatedKey', None)
        all_items.extend(response['Items'])
        if last_key is None:
            break
    today = 0
    this_week = 0
    this_month = len(all_items)
    for item in all_items:
        date = item['createdDate']["S"]
        if date > DAY_AGO:
            today += 1
        if date > WEEK_AGO:
            this_week += 1
        else:
            break
    return today, this_week, this_month


def get_formatted_result(table_name, *args):
    today, week, month = scan_table_counters(table_name, *args)
    total = get_total_count(table_name)
    return {
        'today': today,
        'week': week,
        'month': month,
        'total': total,
    }

def endpoint(event, context):
    resp = {}
    resp['ideas'] = get_formatted_result(IDEAS_TABLE_NAME, 'sortKey', 'idea', 'allIdeasByDate')
    resp['users'] = get_formatted_result(USERS_TABLE_NAME, 'sortKey', 'user', 'createdDateIndex')
    resp['shares'] = get_formatted_result(STATS_ACTIONS_TABLE_NAME, 'actionType', 'share')
    return resp
