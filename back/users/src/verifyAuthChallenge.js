const jwt = require('jsonwebtoken')
const Raven = require("raven");
const RavenLambdaWrapper = require("serverless-sentry-lib");

exports.handler = RavenLambdaWrapper.handler(Raven, (event, context, callback) => {
  try {
    console.log('challengeAnswer', event.request.challengeAnswer)
    jwt.verify(event.request.challengeAnswer, process.env.SECRET_TOKEN)
    event.response.answerCorrect = true
  } catch (err) {
    event.response.answerCorrect = false
  }
  callback(null, event)
})
