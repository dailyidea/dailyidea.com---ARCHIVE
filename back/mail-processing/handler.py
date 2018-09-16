import uuid
from datetime import datetime

import mailparser
from models import IdeaModel, UserModel


def endpoint(event, context):
    mail = mailparser.parse_from_string(event.content)
    from_email = mail.from_
    found_users = UserModel.emailIndex.query(from_email[0][1])
    user = None
    for found_user in found_users:
        user = found_user
    if not user:
        # TOdo process email from user that dont registered
        context.fail()
    try:
        idea = IdeaModel(str(uuid.uuid4()), user.userId)
        idea.content = mail.body
        idea.title = mail.subject
        idea.createdDate = datetime.now()
        idea.save()
        context.succeed()
    except Exception as e:
        context.fail(e)
