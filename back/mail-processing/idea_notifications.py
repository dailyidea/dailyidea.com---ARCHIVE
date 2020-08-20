from datetime import date, datetime
from datetime import timedelta
import logging
from utils.common import progressive_chunks, SEND_BATCH_EMAIL_CHUNK_SIZE
from utils.models import UserModel, IdeaModel, CommentModel, LikeModel
from mail_templates.weekly_stats.send_weekly_stats import send_weekly_stats_bulk
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
    if v.ideaOwnerId not in grouped: grouped[v.ideaOwnerId] = {'comments': []}
    grouped[v.ideaOwnerId]['comments'].append(v.to_dict())

  return dict(grouped)

def last_likes():
  likes_iterator = LikeModel.scan(LikeModel.likedTime >= dayAgo)
  grouped = defaultdict(list)
  for v in likes_iterator:
    if v.ideaOwnerId not in grouped: grouped[v.ideaOwnerId] = {'likes': []}
    grouped[v.ideaOwnerId]['likes'].append(v.to_dict())

  return dict(grouped)

def merge_dicts(*argv):
  merged = {}
  for arg in argv:
    for key in arg:
      if key not in merged: merged[key] = {}
      merged[key].update(arg[key])
  return merged

def endpoint(event, context):
    comments = last_comments()
    likes = last_likes()
    merged = merge_dicts(comments, likes)
    print(merged)
    ## TODO search users by ideaOwnerId
    return ''

    users_iterator = UserModel.scan(
        (UserModel.firstLogin == True) & UserModel.unsubscribedAt.does_not_exist() & (
                    (~UserModel.snoozeEmails.is_type()) | (UserModel.snoozeEmails < now)),
        page_size=SEND_BATCH_EMAIL_CHUNK_SIZE,
        attributes_to_get=['name', 'email', 'userId', 'emailToken'])

    for chunk_to_send in progressive_chunks(users_iterator, SEND_BATCH_EMAIL_CHUNK_SIZE):
        send_weekly_stats_bulk(chunk_to_send)
