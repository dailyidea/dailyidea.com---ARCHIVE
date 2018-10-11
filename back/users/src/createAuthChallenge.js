const OtpChallengeService = require('./aws/OtpChallengeService')


exports.handler = function (event, context) {
  const email = event.request.userAttributes.email
  OtpChallengeService.setupOtpChallenge(email, event, context)
}

