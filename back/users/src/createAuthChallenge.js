const Raven = require("raven");
const RavenLambdaWrapper = require("serverless-sentry-lib");

exports.handler = RavenLambdaWrapper.handler(Raven, function (event, context, callback) {
  event.response.publicChallengeParameters = {}
  event.response.privateChallengeParameters = {}
  event.response.privateChallengeParameters.challenge = 'OTP_CHALLENGE'
  callback(null, event)
})
