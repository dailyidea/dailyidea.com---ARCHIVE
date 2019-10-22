from mail_templates.weekly_digest.send_weekly_digest import send_weekly_digest
from datetime import date
import random


def handler(event, context):
    class User:
        email = 'orion.cx@gmail.com'
        createdDate = str(date.today())

    class Idea:
        def __init__(self):
            self.title = 'test title {}'.format(random.randrange(1, 10000))
            self.id = random.randrange(1,100)
            self.createdDate = '2018-09-26T16:04:11.173995+0000'
            self.likesCount = random.randrange(1,100)
            self.commentsCount = random.randrange(1,100)

    user = User()
    ideas_last_week = [Idea() for _ in range(7)]
    send_weekly_digest(user, ideas_last_week, 3)
