from datetime import date, datetime
from datetime import timedelta
import logging
from utils.common import progressive_chunks, SEND_BATCH_EMAIL_CHUNK_SIZE
from utils.models import UserModel, IdeaModel, CommentModel, LikeModel, one
from mail_templates.idea_notifications.send_idea_notifications import send_idea_notifications_bulk
import os
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration
import itertools
from collections import defaultdict
import json

# logging.basicConfig()
# log = logging.getLogger("pynamodb")
# log.setLevel(logging.DEBUG)
# log.propagate = True

sentry_sdk.init(dsn=os.environ.get('SENTRY_DSN'), integrations=[AwsLambdaIntegration()])

now = datetime.now()
dayAgo = datetime.now() - timedelta(days=1)

def last_comments():
  comments_iterator = CommentModel.scan(CommentModel.createdDate >= dayAgo)
  grouped = {}
  for v in comments_iterator:
    if v.ideaOwnerId not in grouped:
      grouped[v.ideaOwnerId] = {v.ideaId: {'comments': [], 'idea': get_idea(v.ideaId)}}
    if v.ideaId not in grouped[v.ideaOwnerId]:
      grouped[v.ideaOwnerId][v.ideaId] = {'comments': [], 'idea': get_idea(v.ideaId)}
    grouped[v.ideaOwnerId][v.ideaId]['comments'].append(v.to_dict())

  return dict(grouped)

def get_idea(idea_id):
  ideas = IdeaModel.ideasByIdIndex.query(idea_id)
  return one(ideas).to_dict()

# def last_likes():
#   likes_iterator = LikeModel.scan(LikeModel.likedTime >= dayAgo)
#   grouped = defaultdict(list)
#   for v in likes_iterator:
#     if v.ideaOwnerId not in grouped: grouped[v.ideaOwnerId] = {'likes': []}
#     grouped[v.ideaOwnerId]['likes'].append(v.to_dict())
#
#   return dict(grouped)

# def merge_dicts(*argv):
#   merged = {}
#   for arg in argv:
#     for key in arg:
#       if key not in merged: merged[key] = {}
#       merged[key].update(arg[key])
#   return merged

def endpoint(event, context):
    users = last_comments()
    send_idea_notifications_bulk(users)
