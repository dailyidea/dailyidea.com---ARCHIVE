import logging
import os
from ..utils.mail_sender import send_mail_to_user
from jinja2 import Template
import boto3
from ..utils.json_util import loads
from datetime import datetime

client = boto3.client('dynamodb', region_name=os.environ['AWS_REGION'])

USERS_TABLE_NAME = os.environ['USERS_TABLE_NAME']
IDEAS_TABLE_NAME = os.environ['IDEAS_TABLE_NAME']
TAGS_TABLE_NAME = os.environ['TAGS_TABLE_NAME']
STATS_ACTIONS_TABLE_NAME = os.environ['STATS_ACTIONS_TABLE_NAME']

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def get_user_by_id(user_id: str) -> dict:
    resp = client.get_item(
        TableName=USERS_TABLE_NAME,
        Key={'userId': {'S': user_id}}
    )
    return resp.get('Item')


def get_idea_by_id(user_id: str, idea_id: str) -> dict:
    resp = client.get_item(
        TableName=IDEAS_TABLE_NAME,
        Key={'userId': {'S': user_id}, 'ideaId': {'S': idea_id}}
    )
    return resp.get('Item')


def get_idea_tags(idea_id: str):
    resp = client.query(
        TableName=TAGS_TABLE_NAME,
        IndexName='ideaTags',
        KeyConditionExpression="ideaId = :ideaId",
        ExpressionAttributeValues={":ideaId": {"S": idea_id}},
    )
    return map(lambda raw_tag: raw_tag['tag']['S'], resp.get('Items', []))


def create_stats_record(idea_id: str, idea_owner_id: str, email: str, sharer: str, sharer_authorized=False):
    client.put_item(
        TableName=STATS_ACTIONS_TABLE_NAME,
        Item={
            "actionType": {"S": "share"},
            "createdDate": {"S": datetime.now().isoformat()},
            "ideaId": {"S": idea_id},
            "email": {"S": email},
            "idea_owner_id": {"S": idea_owner_id},
            "sharer": {"S": "id_{}".format(sharer) if sharer_authorized else "name_{}".format(sharer)}
        }
    )


def endpoint(event, context):
    # logger.info(event)
    ctx = event.get('ctx')
    arguments = ctx.get('arguments')
    idea_id = arguments.get('ideaId')
    idea_owner_id = arguments.get('ideaOwnerId')
    sender_name = arguments.get('senderName')
    friend_name = arguments.get('friendName')
    email = arguments.get('email')
    identity = ctx.get('identity')
    sender_id = None
    if identity:
        sender_id = identity.get('username')
    idea_to_send = get_idea_by_id(idea_owner_id, idea_id)
    idea_tags = list(get_idea_tags(idea_id))
    if idea_to_send is None:
        return {'ok': False, 'error': 'Idea Not Found'}
    if idea_owner_id != sender_id and idea_to_send['visibility']['S'] != 'PUBLIC':
        return {'ok': False, 'error': 'Idea is private'}

    SUBJECT = f"[Daily Idea] {sender_name} sent you Idea!"  # change to name
    BUCKET_URL_PREFIX = os.environ.get('BUCKET_URL_PREFIX')

    idea_created_time = idea_to_send['createdDate']['S'][:10]
    idea_created_time_formatted = datetime.strptime(idea_created_time, '%Y-%m-%d').strftime('%m/%d/%Y')

    render_context = {
        "tags": idea_tags,
        "friend_name": friend_name,
        "sender_name": sender_name,
        "BUCKET_URL_PREFIX": BUCKET_URL_PREFIX,
        "BASE_SITE_URL": f"https://{os.environ['DOMAIN_NAME']}/",
        "idea": loads(idea_to_send),
        "idea_created_time": idea_created_time_formatted,
        "link_to_idea": f"https://{os.environ['DOMAIN_NAME']}/ideas/{idea_owner_id}/{idea_id}",
        "datetime": datetime,
    }

    with open('./functions/share_idea/share_idea.html') as html_template_file:
        html_template = Template(html_template_file.read())
        with open('./functions/share_idea/share_idea.txt') as txt_template_file:
            txt_template = Template(txt_template_file.read())
            html_content = html_template.render(**render_context)
            txt_content = txt_template.render(**render_context)
            send_mail_to_user(email, SUBJECT, txt_content, html_content)
    create_stats_record(idea_id, idea_owner_id, email, sender_id if sender_id else sender_name, sender_id is not None)
    return {"ok": True}
