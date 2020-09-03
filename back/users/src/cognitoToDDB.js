const aws = require("aws-sdk");
const ddb = new aws.DynamoDB({ apiVersion: "2012-10-08" });
const withSentry = require("serverless-sentry-lib");

function makeid(length) {
   let result           = '';
   const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const charactersLength = characters.length;
   for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

/**
 *
 * Upon Cognito SignUp, a user is added to the DDB table
 *
 * Cognito event:
 * https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-lambda-trigger-examples.html#aws-lambda-triggers-post-confirmation-example
 *
 * Writing to DDB:
 * https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html
 *
 * Sample input:
 *
 {
    version:'1',
    region:'us-east-1',
    userPoolId:'us-east-1_9xasdfasdf3A',
    userName:'budilov@domain.com',
    callerContext:{
       awsSdkVersion:'aws-sdk-unknown-unknown',
       clientId:'1asdfasdfasdfasdf3hjjgp'
    },
    triggerSource:'PostConfirmation_ConfirmSignUp',
    request:{
       userAttributes:{
          sub:'4asdfasfa-944f-4444-9444-e644444444b',
          'cognito:user_status':'CONFIRMED',
          email_verified:'true',
          email:'budilov@domain.com'
       }
    },
    response:{
    }
 }
 * @param event
 * @param context
 */



exports.handler = withSentry(async (event, context) => {
  const date = new Date();

  const tableName = process.env.TABLE_NAME;
  const region = process.env.REGION;
  const setUsersSlug = process.env.SET_USERS_SLUG_FUNCTION_NAME;

  const lambda = new aws.Lambda({
    region,
    apiVersion: "2015-03-31"
  });
  console.log("table=" + tableName + " -- region=" + region);

  aws.config.update({ region });

  // If the required parameters are present, proceed
  if (event.request.userAttributes.sub) {
    // -- Write data to DDB
    const ddbParams = {
      TableName: tableName,
      Item: {
        userId: { S: event.request.userAttributes.sub },
        emailToken: {S: makeid(32)},
        sortKey: { S: "user" },
        email: { S: event.request.userAttributes.email },
        name: { S: event.request.userAttributes.name },
        createdDate: { S: date.toISOString() },
        firstLogin: { BOOL: false },
        // email settings:
        ideaReminders: { BOOL: true },
        hotStreaks: { BOOL: true },
        dailyDigests: { BOOL: true },
        weeklyDigests: { BOOL: true },
        ideaActivity: { BOOL: true },

        followersCount: {N: '0'},
        ideasCreated: {N: '0'},
        followeesCount: {N: '0'},
      }
    };

    // Call DynamoDB
    try {
      await ddb.putItem(ddbParams).promise();
      console.log("Success");
    } catch (err) {
      console.log("Error", err);
    }

    console.log("Success: Everything executed correctly");

    const requestCreateSlug = lambda.invoke({
      FunctionName: setUsersSlug,
      Payload: JSON.stringify(
        {
          userId: event.request.userAttributes.sub,
          userName: event.request.userAttributes.name
        },
        null,
        2
      ), // pass params
      LogType: "Tail"
    });
    try {
      // request.send()

      await requestCreateSlug.promise();
      context.done(null, event);
    } catch (err) {
      context.done("error", err);
    }
  } else {
    // Nothing to do, the user's email ID is unknown
    console.log("Error: Nothing was written to DDB or SQS");
    context.done(null, event);
  }
});
