const aws = require("aws-sdk");
const ddb = new aws.DynamoDB({ apiVersion: "2012-10-08" });

exports.handler = async (event, context, callback) => {
  // Send post authentication data to Cloudwatch logs
  console.log("Authentication successful");
  console.log("Trigger function =", event.triggerSource);
  console.log("User pool = ", event.userPoolId);
  console.log("App client ID = ", event.callerContext.clientId);
  console.log("User ID = ", event.userName);

  const usersTableName = process.env.USERS_TABLE_NAME;

  const requestParams = {
    Key: {
      userId: {
        S: event.userName
      }
    },
    TableName: usersTableName
  };
  let userProfile = await ddb.getItem(requestParams).promise();
  userProfile = userProfile.Item
  const firstLogin = userProfile.firstLogin.BOOL
  if (!firstLogin) {
    const params = {
      ExpressionAttributeNames: {
        "#firstLogin": "firstLogin"
      },
      ExpressionAttributeValues: {
        ":true": {
          BOOL: true
        }
      },
      Key: {
        userId: {
          S: event.userName
        }
      },
      TableName: usersTableName,
      UpdateExpression: "SET #firstLogin = :true"
    };
    const sendDailyToUser = process.env.SEND_DAILY_TO_USER_FUNCTION_NAME;
    const region = process.env.REGION;

    const lambda = new aws.Lambda({
      region,
      apiVersion: "2015-03-31"
    });

    await ddb.updateItem(params).promise();
    const requestSendDaily = lambda.invoke({
      FunctionName: sendDailyToUser,
      Payload: JSON.stringify(
        { email: event.request.userAttributes.email },
        null,
        2
      ), // pass params
      InvocationType: "Event",
      LogType: "Tail"
    });
    await requestSendDaily.promise();
  }

  // Return to Amazon Cognito
  callback(null, event);
};
