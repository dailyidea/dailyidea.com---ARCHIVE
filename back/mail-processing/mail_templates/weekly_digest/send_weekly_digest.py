import os
import boto3
import json

AWS_REGION = os.environ['SES_AWS_REGION']
MAILBOX_ADDR = os.environ['MAILBOX_ADDR']


SENDER = f"Daily Idea <{MAILBOX_ADDR}>"


def get_mail_basic_props(user, ideas):
    props = {
    }
    ideas_this_week_count = len(ideas)
    if ideas_this_week_count > 0:
        props['title'] = 'Last week, you responded to'
        props['subtitle'] = f'{ideas_this_week_count} ideas!'
        props['subsubtitle'] = None
        if ideas_this_week_count > 6:
            props['text'] = 'Wow, perfect!'
        elif ideas_this_week_count > 3:
            props['text'] = 'Great job!'
        else:
            props['text'] = f"Let's aim for {ideas_this_week_count + 1} this week!"
    else:
        props['title'] = 'Awww'
        props['subtitle'] = 'We missed you last week :('
        props['subsubtitle'] = 'Anything we can do to help you with responding for ideas? :)'
        props['text'] = None
    props[
        'footer'] = f"You've now submitted a total of {user.ideasCreated} ideas to Daily Idea since you joined on {user.createdDate.strftime('%m/%d/%Y')}!" if user.ideasCreated > 0 else None
    return props


def bulk_send_weekly_digest(users_and_ideas_tuples_list):
    WEEKLY_DIGEST_TEMPLATE_NAME = os.environ.get('WEEKLY_DIGEST_TEMPLATE_NAME')
    BUCKET_URL_PREFIX = os.environ.get('BUCKET_URL_PREFIX')
    DOMAIN_NAME = os.environ.get('DOMAIN_NAME')
    client = boto3.client('ses', region_name=AWS_REGION)
    destinations = []
    for (user, ideas) in users_and_ideas_tuples_list:
        mail_basic_props = get_mail_basic_props(user, ideas)
        destinations.append({
            'Destination': {
                'ToAddresses': [
                    user.email,
                ],
            },
            'ReplacementTemplateData': json.dumps(
                {
                    "title": mail_basic_props['title'],
                    "subtitle": mail_basic_props['subtitle'],
                    "subsubtitle": mail_basic_props['subsubtitle'],
                    "text": mail_basic_props['text'],
                    "footer": mail_basic_props['footer'],
                    "ideasToSend": [{
                        "userId": idea.userId,
                        "ideaId": idea.ideaId,
                        "ideaTitle": idea.title,
                        "authorName": idea.authorName,
                        "createdDay": idea.createdDate.strftime("%A"),
                        "content": idea.content,
                        "likesCount": idea.likesCount,
                        "commentsCount": idea.commentsCount,
                    } for idea in ideas]
                })
        })
    if len(destinations) > 0:
        client.send_bulk_templated_email(
            Source=SENDER,
            Template=WEEKLY_DIGEST_TEMPLATE_NAME,
            DefaultTemplateData=json.dumps(
                {"BUCKET_URL_PREFIX": BUCKET_URL_PREFIX, "DOMAIN_NAME": DOMAIN_NAME}),
            Destinations=destinations
        )
