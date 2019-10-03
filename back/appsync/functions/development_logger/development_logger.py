import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def endpoint(event, lambda_context):
    logger.info(event)
    logger.info(event['ctx']['stash'])
    return event['ctx']['prev']['result']