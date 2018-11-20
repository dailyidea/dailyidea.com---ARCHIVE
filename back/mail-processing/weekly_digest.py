import os
from datetime import date, datetime
from datetime import timedelta

from mako.template import Template

from utils.mail_sender import send_mail_to_user
from utils.models import UserModel, IdeaModel

MAILBOX_ADDR = os.environ['MAILBOX_ADDR']
BASE_SITE_URL = f"https://{os.environ['DOMAIN_NAME']}/"

SENDER = f"Daily Idea <{MAILBOX_ADDR}>"

SUBJECT = f"[Daily Idea] Weekly Digest"


def getBodyText(user, ideas_last_week, num_ideas):
    return Template("""
    Hi ${user.email}!
    % if num_days == 7:
    Wow, perfect! You responded to 7 emails last week with ideas!
    % elif num_days in (6,5,4):
    Great job! You responded to 5 emails last week with ideas!
    four/five
    % elif num_days in (3,2):
    You responded to 1 idea last week! Let's aim for 2 this week!
    % elif num_days == 1:
    You responded to 1 idea last week! Let's aim for 2 this week!
    % else:
    Awww we missed you last week :( Anything we can do to help you with responding for ideas? :)
    % endif
    Here are the ideas you submitted:
    % for idea in ideas_last_week:
      Monday Jun 20 - > ${idea.title} ${BASE_SITE_URL}ideas/${idea.id}
    % endfor
    You've now submitted a total of ${num_ideas} ideas to Daily Idea since you joined on ${user.createdDate}!
    """).render(user=user, num_days=len(list(ideas_last_week)), num_ideas=num_ideas, ideas_last_week=ideas_last_week)


def endpoint(event, context):
    today = datetime.now()
    today_day = date.today().weekday()
    for user in UserModel.scan():
        if str(today_day) in user.ideasMailSchedule:
            week_ago = today - timedelta(weeks=1)
            ideas_last_week = IdeaModel.scan(
                (IdeaModel.ideaDate > week_ago) & (
                            IdeaModel.userId == user.userId))
            ideas_total = IdeaModel.scan(IdeaModel.userId == user.userId)
            send_mail_to_user(user.email, SUBJECT,
                              getBodyText(user, ideas_last_week, len(list(ideas_total))), '')
#
# if __name__ == "__main__":
#     endpoint(1, 1)
