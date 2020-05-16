const aws = require("aws-sdk");
const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider();
const Raven = require("raven");
const RavenLambdaWrapper = require("serverless-sentry-lib");

exports.handler = RavenLambdaWrapper.handler(Raven, async (event, context, callback) => {
  const params = {
    UserPoolId: process.env.USER_POOL_ID /* required */,
    AttributesToGet: [
      "sub"
      /* more items */
    ],
    Filter: `email="${event.request.userAttributes.email}"`,
    Limit: "1"
  };
  let userAlreadyExists = true;
  try {
    const usersList = await cognitoidentityserviceprovider
      .listUsers(params)
      .promise();
    if (usersList.Users.length === 0) {
      userAlreadyExists = false;
    }
  } catch (e) {
    Raven.captureException(e)
    console.log(e);
  }
  if (!userAlreadyExists) {
    event.response.autoConfirmUser = true;
    // Set the email as verified if it is in the request
    if (event.request.userAttributes.hasOwnProperty("email")) {
      event.response.autoVerifyEmail = true;
    }
  }

  // Confirm the user

  // Return to Amazon Cognito
  callback(null, event);
});
