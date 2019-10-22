from utils.mail_sender import send_mail_to_user
from jinja2 import Template
import os
from datetime import datetime


def send_weekly_digest(user, ideas_last_week, num_ideas):
    SUBJECT = f"[Daily Idea] Weekly Digest"
    BUCKET_URL_PREFIX = os.environ.get('BUCKET_URL_PREFIX')
    render_context = {
        "user": user,
        "BUCKET_URL_PREFIX": BUCKET_URL_PREFIX,
        "BASE_SITE_URL": f"https://{os.environ['DOMAIN_NAME']}/",
        "ideas_last_week": ideas_last_week,
        "num_days": min(7, len(list(ideas_last_week))),
        "num_ideas": num_ideas,
        "datetime": datetime,
    }
    with open('./mail_templates/weekly_digest/weekly_digest.html') as html_template_file:
        html_template = Template(html_template_file.read())
        with open('./mail_templates/weekly_digest/weekly_digest.txt') as txt_template_file:
            txt_template = Template(txt_template_file.read())
            html_content = html_template.render(**render_context)
            txt_content = txt_template.render(**render_context)
            send_mail_to_user(user.email, SUBJECT, txt_content, html_content)
