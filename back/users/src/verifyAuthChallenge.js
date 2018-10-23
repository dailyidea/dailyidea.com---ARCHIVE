const jwt = require('jsonwebtoken');

exports.handler = (event, context, callback) => {
    if (jwt.verify(event.request.challengeAnswer, process.env.SECRET_TOKEN)) {
        event.response.answerCorrect = true;
    } else {
        event.response.answerCorrect = false;
    }
    // Return to Amazon Cognito
    callback(null, event);
}
