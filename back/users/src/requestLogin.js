const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const middy = require("middy");
const { cors, jsonBodyParser, httpErrorHandler } = require("middy/middlewares");
const Sqrl = require("squirrelly");

const templatePath = path.join(
  __dirname,
  "../mail-templates/require_login_template.html"
);
const requireLoginTemplateHTMLTemplateRAw = fs.readFileSync(
  templatePath,
  "utf8"
);

const requireLoginTemplateHTMLCompiled = Sqrl.Compile(
  requireLoginTemplateHTMLTemplateRAw
);

const generateToken = function(email) {
  return jwt.sign(
    {
      email
    },
    process.env.SECRET_TOKEN,
    { expiresIn: "1h" }
  );
};

// AWS.config.update({
//   region: process.env.DYNAMO_REGION
// })

const sendEmail = function(email, token, name = undefined) {
  const emailEncoded = encodeURIComponent(email);
  const ses = new AWS.SES({
    region: process.env.SES_REGION
  });
  const eParams = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: requireLoginTemplateHTMLCompiled(
            {
              BUCKET_URL_PREFIX: process.env.BUCKET_URL_PREFIX,
              DOMAIN_NAME: process.env.DOMAIN_NAME,
              email,
              token,
              emailEncoded,
              name
            },
            Sqrl
          )
        },
        Text: {
          Charset: "UTF-8",
          Data: `
            Hi!
            
            We received a request to log in to your Daily Idea account ${email}. 
            Visit this url in a browser: https://${process.env.DOMAIN_NAME}/auth/verify?code=${token}&email=${emailEncoded}
            If you did not request this, you can ignore this email! The only way anybody can log in to your account is via links sent to your email (${email}). 
          `
        }
      },
      Subject: {
        Data: `[Daily Idea] Log in link for ${email}`
      }
    },
    // environment variable
    Source: process.env.SOURCE_EMAIL
  };
  // console.log("send mail params", eParams);

  return ses.sendEmail(eParams).promise();
};

// This is your common handler, no way different than what you are used to do every day
// in AWS Lambda
const sendMail = async (event, context) => {
  const { email } = event.body;
  console.log("generating log token", email);
  const docClient = new AWS.DynamoDB.DocumentClient();

  try {
    const result = await docClient
      .query({
        TableName: process.env.TABLE_NAME,
        IndexName: "emailIndex",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email
        }
      })
      .promise();

    if (result.Count === 0) {
      console.log("Not Found", email);
      return {
        statusCode: 400,
        body: JSON.stringify({ result: "error", message: "Email not found" })
      };
    } else {
      console.log("Found", email);
      const token = generateToken(email);
      const name = result.Items[0].name;
      await sendEmail(email, token, name, context);
      return {
        body: JSON.stringify({ result: "success" })
      };
    }
  } catch (e) {
    console.log("error", e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        result: "error",
        message: "Internal Server Error"
      })
    };
  }
};

const handler = middy(sendMail)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());

module.exports = { handler };
