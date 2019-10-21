from utils.mail_sender import send_mail_to_user
from jinja2 import Template
import os
from datetime import date


def send_daily(user):
    BUCKET_URL_PREFIX = os.environ.get('BUCKET_URL_PREFIX')
    DOMAIN_NAME = os.environ.get('DOMAIN_NAME')
    SUBJECT = f"[Daily Idea] Idea for {date.today().strftime('%a %b %d %Y')}"
    render_context = {
        "BUCKET_URL_PREFIX": BUCKET_URL_PREFIX,
        "DOMAIN_NAME": DOMAIN_NAME,
    }
    with open('./mail_templates/request_daily_idea/daily_idea.html') as html_template_file:
        html_template = Template(html_template_file.read())
        with open('./mail_templates/request_daily_idea/daily_idea.txt') as txt_template_file:
            txt_template = Template(txt_template_file.read())
            html_content = html_template.render(**render_context)
            txt_content = txt_template.render(**render_context)
            send_mail_to_user(user.email, SUBJECT, txt_content, html_content)
