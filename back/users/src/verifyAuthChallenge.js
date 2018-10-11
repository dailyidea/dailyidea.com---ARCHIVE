exports.handler = (event, context, callback) => {
    if (event.request.privateChallengeParameters.answer == event.request.challengeAnswer) {
        event.response.answerCorrect = true;
    } else {
        event.response.answerCorrect = false;
    }
    // Return to Amazon Cognito
    callback(null, event);
}
