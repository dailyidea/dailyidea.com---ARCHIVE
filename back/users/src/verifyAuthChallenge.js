const jwt = require('jsonwebtoken')

exports.handler = (event, context, callback) => {
  try {
    console.log('challengeAnswer', event.request.challengeAnswer)
    jwt.verify(event.request.challengeAnswer, process.env.SECRET_TOKEN)
    event.response.answerCorrect = true
  } catch (err) {
    event.response.answerCorrect = false
  }
  callback(null, event)
}
