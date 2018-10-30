exports.handler = function (event, context, callback) {
  event.response.publicChallengeParameters = {}
  event.response.privateChallengeParameters = {}
  event.response.privateChallengeParameters.challenge = 'OTP_CHALLENGE'
  callback(null, event)
}

