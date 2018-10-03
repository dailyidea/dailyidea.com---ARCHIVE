import os
import uuid
from datetime import datetime

import boto3
import mailparser

from mail_sender import send_mail_to_user
from models import IdeaModel, UserModel

AWS_REGION = os.environ['SES_AWS_REGION']
SES_S3_BUCKET_NAME = os.environ['SES_S3_BUCKET_NAME']

s3 = boto3.client('s3')
ses = boto3.client('ses', region_name=AWS_REGION)


def processIncomingMail(parsed_email):
    from_email = parsed_email.from_
    found_users = UserModel.emailIndex.query(from_email[0][1])
    user = None
    for found_user in found_users:
        user = found_user
    if not user:
        # TOdo process email from user that dont registered
        return

    idea = IdeaModel(str(uuid.uuid4()), user.userId)
    idea.content = (parsed_email.text_plain and parsed_email.text_plain[0]) or \
                   (parsed_email.text_html and parsed_email.text_html[0])
    idea.title = parsed_email.subject
    idea.createdDate = datetime.now()
    # idea.ideaDate = datetime.now()  TODO parse idea date from somehwere
    idea.save()


def endpoint(event, context):
    if 'ses' not in event['Records'][0]:
        print('this was not an SES event.  event["Records"][0]["ses"] not found')
        return
    ses_notification = event['Records'][0]['ses']
    mail_message_id = ses_notification['mail']['messageId']
    print(f"Message Id received: {mail_message_id}")

    try:
        data = s3.get_object(Bucket=SES_S3_BUCKET_NAME, Key=mail_message_id)
        raw_email = data['Body'].read()
        parsed_email = mailparser.parse_from_string(raw_email.decode('utf-8'))
        processIncomingMail(parsed_email)
        send_mail_to_user(parsed_email.from_, parsed_email.subject, '', '')
    except Exception as e:
        print(e)
        raise e
