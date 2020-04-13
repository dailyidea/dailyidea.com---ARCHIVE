from utils.mail_sender import send_mail_to_user
from jinja2 import Template
import os


def send_not_registered_error_message(from_email, subject):
    # BUCKET_URL_PREFIX = os.environ.get('BUCKET_URL_PREFIX')
    DOMAIN_NAME = os.environ.get('DOMAIN_NAME')
    LOGIN_URL = f"https://{DOMAIN_NAME}/auth/signup"
    render_context = {
        # "BUCKET_URL_PREFIX": BUCKET_URL_PREFIX,
        "LOGIN_URL": LOGIN_URL,
        "from_email": from_email,
    }
    with open(
            './mail_templates/idea_sender_not_is_not_registered/idea_sender_not_is_not_registered.html') as html_template_file:
        html_template = Template(html_template_file.read())
        with open(
                './mail_templates/idea_sender_not_is_not_registered/idea_sender_not_is_not_registered.txt') as txt_template_file:
            txt_template = Template(txt_template_file.read())
            html_content = html_template.render(**render_context)
            txt_content = txt_template.render(**render_context)
            send_mail_to_user(from_email, subject, txt_content, html_content)
