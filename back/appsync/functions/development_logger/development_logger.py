import json
import logging
from raven import Client # Offical `raven` module
from raven_python_lambda import RavenLambdaWrapper

logger = logging.getLogger()
logger.setLevel(logging.INFO)

@RavenLambdaWrapper()
def endpoint(event, lambda_context):
    logger.info(event)
    logger.info(event['ctx']['stash'])
    return event['ctx']['prev']['result']
