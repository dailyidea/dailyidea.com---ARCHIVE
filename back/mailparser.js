import AWS from 'aws-sdk'
import {simpleParser} from 'mailparser'
import uuid from 'uuid'

const USER_TABLE = process.env.USER_TABLE;
const IDEA_TABLE = process.env.IDEA_TABLE;
const AWS_DEPLOY_REGION = process.env.AWS_DEPLOY_REGION;

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    api_version: '2012-08-10',
    region: AWS_DEPLOY_REGION
});


exports.handler = async (event, context) => {
    const mail = await simpleParser(event.content)
    const from = mail.from.text

    const user = await new Promise((resolve, reject) => {
        dynamoDb.get({
            TableName: USER_TABLE,
            Key: {
                email: from
            }
        }, function (err, data) {
            if (err) {
                console.log(`getMessage ERROR=${error.stack}`);
                reject();
            } else if (!data || typeof data === 'undefined' || !data.Item) {
                console.log(`did not find user with mail=${from}`)
                reject()
            } else {
                resolve(data.Item)
            }
        });
    })
    const params = {
        TableName: IDEA_TABLE,
        Item: {
            ideaId: uuid.v1(), userId: user.id, content: mail.text
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



