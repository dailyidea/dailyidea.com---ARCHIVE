import json
import logging
import os
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

sentry_sdk.init(dsn=os.environ.get('SENTRY_DSN'), integrations=[AwsLambdaIntegration()])

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def endpoint(event, lambda_context):
    logger.info(event)
    logger.info(event['ctx']['stash'])
    return event['ctx']['prev']['result']
