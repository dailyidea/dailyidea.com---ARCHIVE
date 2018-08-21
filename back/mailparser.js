import AWS from 'aws-sdk'
import {simpleParser} from 'mailparser'
import uuid from 'uuid'

const MESSAGES_TABLE = process.env.MESSAGES_TABLE;
const AWS_DEPLOY_REGION = process.env.AWS_DEPLOY_REGION;

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    api_version: '2012-08-10',
    region: AWS_DEPLOY_REGION
});


exports.handler = async (event, context) => {
    const mail = await simpleParser(event.content)
    const from = mail.from.text

  const params = {
    TableName: MESSAGES_TABLE,
    Item: {
        ideaId: uuid.v1(), userId: 'todo', content: mail.text
    },
  };

  try {
    const data = await dynamoDb.put(params).promise();
    context.succeed()
  } catch (error) {
    console.log(`createChatMessage ERROR=${error.stack}`);
    context.fail()
  }

}



