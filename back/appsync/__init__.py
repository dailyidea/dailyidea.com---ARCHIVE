import sentry_sdk

sentry_sdk.init(os.environ['SENTRY_URL'])
