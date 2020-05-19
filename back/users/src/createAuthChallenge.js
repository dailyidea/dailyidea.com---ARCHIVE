const withSentry = require("serverless-sentry-lib"); // This helper library

exports.handler = withSentry(function (event, context, callback) {
  event.response.publicChallengeParameters = {}
  event.response.privateChallengeParameters = {}
  event.response.privateChallengeParameters.challenge = 'OTP_CHALLENGE'
  callback(null, event)
})
