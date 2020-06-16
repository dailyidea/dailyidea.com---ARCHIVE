const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const middy = require("middy");
const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
const { cors, jsonBodyParser, httpErrorHandler } = require("middy/middlewares");
const Sqrl = require("squirrelly");
const withSentry = require("serverless-sentry-lib"); // This helper library
const Sentry = require("@sentry/node");

const getCompiledTemplateFromPath = templatePath => {
  const fullTemplatePath = path.join(__dirname, templatePath);
  const templateHTMLRAw = fs.readFileSync(fullTemplatePath, "utf8");
  return Sqrl.Compile(templateHTMLRAw);
};

const getLoginTemplate = (
  firstLogin,
  withComment = false,
  ideaToSave = false
) => {
  let activePath;
  if (firstLogin) {
    if (withComment) {
      activePath = "../mail-templates/magic_link_template_with_comment.html";
    } else if (ideaToSave) {
      activePath = "../mail-templates/magic_link_template_with_idea_save.html";
    } else {
      activePath = "../mail-templates/signup_template.html";
    }
  } else if (withComment) {
    activePath = "../mail-templates/require_login_template_with_comment.html";
  } else if (ideaToSave) {
    activePath = "../mail-templates/require_login_template_with_idea_save.html";
  } else {
    activePath = "../mail-templates/require_login_template.html";
  }
  return getCompiledTemplateFromPath(activePath);
};

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

const sendEmail = async function(
  email,
  token,
  name = undefined,
  commentId = undefined,
  ideaToSaveId = undefined,
  next = undefined
) {
  const emailEncoded = encodeURIComponent(email);
  const ses = new AWS.SES({
    region: process.env.SES_REGION
  });
  const ddbParams = {
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": {
        S: email
      }
    },
    IndexName: "emailIndex",
    TableName: process.env.USERS_TABLE_NAME
  };
  let firstLogin = false;
  try {
    const resp = await ddb.query(ddbParams).promise();
    const profile = resp.Items[0];
    firstLogin = !profile.firstLogin.BOOL;
  } catch (err) {
    console.log("Error", err);
  }

  let comment;
  let commentIdea;

  if (commentId) {
    const ddbParams = {
      KeyConditionExpression: "commentId = :commentId",
      ExpressionAttributeValues: {
        ":commentId": {
          S: commentId
        }
      },
      TableName: process.env.IDEA_COMMENTS_TEMPORARY_TABLE_NAME
    };
    try {
      const resp = await ddb.query(ddbParams).promise();
      comment = resp.Items[0];
    } catch (err) {
      console.log("Error when fetching comment", err);
    }
    
    if(comment) {
      const ideaddbParams = {
        KeyConditionExpression: "ideaId = :ideaId",
        ExpressionAttributeValues: {
          ":ideaId": {
            S: comment.ideaId.S
          }
        },
        IndexName: "ideasById",
        TableName: process.env.IDEAS_TABLE_NAME
      };

      try {
        const resp = await ddb.query(ideaddbParams).promise();
        commentIdea = resp.Items[0];
      } catch(err) {
        console.log("Error while fetching comment idea", err);
      }
    }
  }

  let ideaToSave;

  if (ideaToSaveId) {
    const ddbParams = {
      KeyConditionExpression: "ideaId = :ideaId",
      ExpressionAttributeValues: {
        ":ideaId": {
          S: ideaToSaveId
        }
      },
      IndexName: "ideasById",
      TableName: process.env.IDEAS_TABLE_NAME
    };
    try {
      const resp = await ddb.query(ddbParams).promise();
      ideaToSave = resp.Items[0];
      console.log("ideaToSave");
    } catch (err) {
      console.log("Error when fetching idea");
      console.log(process.env.IDEAS_TABLE_NAME);
      console.log(JSON.stringify(err, null, ""));
    }
  }

  const templateParams = {
    BUCKET_URL_PREFIX: process.env.BUCKET_URL_PREFIX,
    DOMAIN_NAME: process.env.DOMAIN_NAME,
    email,
    token,
    emailEncoded,
    name,
    verifyAdditionalUrlParams: ""
  };

  if (comment && commentIdea) {
    const ideaURLPath = `/i/${commentIdea.shortId.S}/${commentIdea.slug.S}`;
    templateParams.verifyAdditionalUrlParams = `&fc=1&next=${encodeURIComponent(
      `${ideaURLPath}?aa=itc&tci=${comment.commentId.S}`
    )}`;
    templateParams.commentText = comment.body.S;
    templateParams.ideaHref = `https://${templateParams.DOMAIN_NAME}${ideaURLPath}`;
    templateParams.ideaName = comment.ideaName.S;
  } else if (ideaToSave) {
    try {
      const ideaURLPath = `/ideas/${ideaToSave.userId.S}/${ideaToSave.ideaId.S}`;
      templateParams.verifyAdditionalUrlParams = `&fis=1&next=${encodeURIComponent(
        `${ideaURLPath}?aa=si`
      )}`;
      templateParams.ideaHref = `https://${templateParams.DOMAIN_NAME}${ideaURLPath}`;
      templateParams.ideaName = ideaToSave.title.S;
    } catch (err) {
      console.log(JSON.stringify(err, null, ""));
    }
  }else if(next){
    templateParams.verifyAdditionalUrlParams = `&next=${encodeURIComponent(next)}`;
  }

  const htmlTemplate = getLoginTemplate(firstLogin, !!comment, !!ideaToSave);

  const eParams = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlTemplate(templateParams, Sqrl)
        },
        Text: {
          Charset: "UTF-8",
          Data: firstLogin
            ? `
            Welcome!
            
            Ready to share your rides? Simply follow the magic link below, and that's it. You're done!
            https://${process.env.DOMAIN_NAME}/auth/verify?code=${token}&email=${emailEncoded}
          `
            : `
            Hi!
            
            We received a request to log in to your Daily Idea account ${email}. 
            Visit this url in a browser: https://${process.env.DOMAIN_NAME}/auth/verify?code=${token}&email=${emailEncoded}
            If you did not request this, you can ignore this email! The only way anybody can log in to your account is via links sent to your email (${email}). 
          `
        }
      },
      Subject: {
        Data: firstLogin
          ? `[Daily Idea] Magic link for ${email}`
          : `[Daily Idea] Log in link for ${email}`
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
  const { email, commentId, ideaToSaveId, next } = event.body;
  // commentId is defined in case when user logs in after unauth comment attempt
  // ideaToSaveId is defined in case when user logs in after unauth save idea attempt
  console.log("generating log token", email);
  console.log("commentId", commentId);
  console.log("next", next);
  console.log("ideaToSaveId", ideaToSaveId);
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
    console.log(result);
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
      const sendMailResp = await sendEmail(
        email,
        token,
        name,
        commentId,
        ideaToSaveId,
        next,
        context
      );
      console.log("---------mail sending------");
      console.log(sendMailResp);
      console.log("---------end mail sending-------");
      return {
        body: JSON.stringify({ result: "success" })
      };
    }
  } catch (e) {
    console.log("error", e);
    Sentry.captureException(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        result: "error",
        message: "Internal Server Error"
      })
    };
  }
};

const handler = withSentry(middy(sendMail)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors()));

module.exports = { handler };
