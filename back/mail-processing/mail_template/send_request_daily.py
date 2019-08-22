import os
from datetime import date

from utils.mail_sender import send_mail_to_user

AWS_REGION = os.environ['SES_AWS_REGION']
MAILBOX_ADDR = os.environ['MAILBOX_ADDR']

SENDER = f"Daily Idea <{MAILBOX_ADDR}>"

SUBJECT = f"[Daily Idea] Idea for {date.today().strftime('%a %b %d %Y')}"

BODY_TEXT = """
What's your idea for today?
Reminder: Don't be concerned with having amazing ideas every day! It can be silly, bad, half baked, or even a repeat. It's more important to do your best to submit something every day. Over time, forcing yourself to write down lots of ideas will turn you into an idea machine! You can always add on to your past ideas or edit them later.
To submit your idea, just respond to this email. The first line of your response will be the title of your idea. The rest of it will be turned into a summary of your idea. (Here's an example).
"""

BODY_HTML = """<html>
<head></head>
<body>

<strong>What's your idea for today?</strong>
    <p>Reminder: Don't be concerned with having amazing ideas every day! It can be silly, bad, half baked, or even a repeat. It's more important to do your best to submit something every day. Over time, forcing yourself to write down lots of ideas will turn you into an idea machine! You can always add on to your past ideas or edit them later.</p>
    <p>To submit your idea, just respond to this email. The first line of your response will be the title of your idea. The rest of it will be turned into a summary of your idea. (Here's an example).</p>
</body>
</html>
"""


def send_daily(user):
    send_mail_to_user(user.email, SUBJECT, BODY_TEXT, BODY_HTML)

#
# if __name__ == '__main__':
#     endpoint('1','2')
