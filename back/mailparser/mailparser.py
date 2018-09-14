import uuid

import mailparser
from models import IdeaModel, UserModel


def endpoint(event, context):
    mail = mailparser.parse_from_string(event.content)
    from_email = mail.from_
    try:
        user = UserModel.get(UserModel.email == from_email)
    except UserModel.DoesNotExist:
        context.fail()
        return
    try:
        idea = IdeaModel(uuid.uuid4())
        idea.content = mail.text_plain
        idea.title = mail.subject
        idea.userId = user.userId
        idea.save()
        context.succeed()
    except Exception:
        context.fail()
