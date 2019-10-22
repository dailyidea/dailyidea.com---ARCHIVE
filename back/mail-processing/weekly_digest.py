from datetime import date, datetime
from datetime import timedelta

from utils.models import UserModel, IdeaModel

from mail_templates.weekly_digest.send_weekly_digest import send_weekly_digest

SUBJECT = f"[Daily Idea] Weekly Digest"

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
            send_weekly_digest(user, ideas_last_week, len(list(ideas_total)))