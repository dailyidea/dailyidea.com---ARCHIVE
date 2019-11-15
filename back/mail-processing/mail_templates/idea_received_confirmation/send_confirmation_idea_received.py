from utils.mail_sender import send_mail_to_user
from jinja2 import Template
import os
from datetime import date


def send_confirmation(email_to_reply, idea, subject):
    BUCKET_URL_PREFIX = os.environ.get('BUCKET_URL_PREFIX')
    DOMAIN_NAME = os.environ.get('DOMAIN_NAME')
    BASE_SITE_URL = f"https://{DOMAIN_NAME}"
    render_context = {
        "BUCKET_URL_PREFIX": BUCKET_URL_PREFIX,
        "BASE_SITE_URL": BASE_SITE_URL,
        "IDEA_LINK": f"{BASE_SITE_URL}/ideas/{idea.userId}/{idea.ideaId}",
        "idea": idea,
    }
    with open('./mail_templates/idea_received_confirmation/idea_received_confirmation.html') as html_template_file:
        html_template = Template(html_template_file.read())
        with open('./mail_templates/idea_received_confirmation/idea_received_confirmation.txt') as txt_template_file:
            txt_template = Template(txt_template_file.read())
            html_content = html_template.render(**render_context)
            txt_content = txt_template.render(**render_context)
            send_mail_to_user(email_to_reply, subject, txt_content, html_content)
