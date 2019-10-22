from mail_templates.weekly_digest.send_weekly_digest import send_weekly_digest
from datetime import date


def handler(event, context):
    class User:
        email = 'orion.cx@gmail.com'
        createdDate = str(date.today())

    class Idea:
        title = 'test title'
        id = 3

    user = User()
    ideas_last_week = [Idea(), Idea(), Idea()]
    send_weekly_digest(user, ideas_last_week, 3)
