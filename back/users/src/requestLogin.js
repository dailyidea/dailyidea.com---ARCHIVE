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
const uuid = require('uuid')
const fetch = require('node-fetch')
const quotes = require('../common/qoutes.json') // common folder was inluded to project folder by serverless: serverless.yml package.include

const getCompiledTemplateFromPath = templatePath => {
  const fullTemplatePath = path.join(__dirname, templatePath);
  const templateHTMLRAw = fs.readFileSync(fullTemplatePath, "utf8");
  return Sqrl.Compile(templateHTMLRAw);
};

const getLoginTemplate = (
  firstLogin,
  withComment = false,
  ideaToSave = false,
  isMobile = false,
  createIdea = false
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
  } else if (isMobile) {
    activePath = "../mail-templates/require_login_template_mobile.html";
  } else if (createIdea) {
    activePath = "../mail-templates/require_login_template_create_idea.html";
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

async function setDefaultAvatar (docClient, user) {
  // Skip if avatar already exists
  if (user.avatar) {
    return
  }

  const resp = await fetch(`https://avatars.dicebear.com/api/bottts/${user.userId}.svg`)
  const svg = await resp.text()
  const idParts = uuid.v4().split('-')
  const id = idParts[idParts.length - 2]
  const filename = `daily-idea-avatar-${user.userId}-${id}.svg`
  const s3 = new AWS.S3()
  await s3.putObject({Bucket: process.env.AVATAR_STATIC_BUCKET_NAME, Key: filename, Body: svg, ACL: 'public-read', ContentType: 'image/svg+xml'}).promise()
  const url = `${process.env.AVATAR_STATIC_BUCKET_URL}/${filename}`

  await docClient.update({
    TableName: process.env.USERS_TABLE_NAME,
    Key: { userId: user.userId },
    UpdateExpression: "SET avatar = :avatar",
    ExpressionAttributeValues: {
      ':avatar': url,
    },
  }).promise()
}

const sendEmail = async function(
  email,
  token,
  name = undefined,
  commentId = undefined,
  ideaToSaveId = undefined,
  ideaToLikeId = undefined,
  next = undefined,
  context,
  code,
  isMobile
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
  let ideaToLike;

  if (ideaToSaveId || ideaToLikeId) {
    const ddbParams = {
      KeyConditionExpression: "ideaId = :ideaId",
      ExpressionAttributeValues: {
        ":ideaId": {
          S: ideaToSaveId || ideaToLikeId
        }
      },
      IndexName: "ideasById",
      TableName: process.env.IDEAS_TABLE_NAME
    };
    try {
      const resp = await ddb.query(ddbParams).promise();
      if(ideaToSaveId) {
        console.log("ideaToSave");
        ideaToSave = resp.Items[0];
      } else {
        console.log("ideaToLike");
        ideaToLike = resp.Items[0];
      }
    } catch (err) {
      console.log("Error when fetching idea");
      console.log(process.env.IDEAS_TABLE_NAME);
      console.log(JSON.stringify(err, null, ""));
    }
  }

  const quoteFiltered = quotes.filter(q => q.include)
  const quote = quoteFiltered[Math.floor(Math.random() * quoteFiltered.length)]

  const templateParams = {
    BUCKET_URL_PREFIX: process.env.BUCKET_URL_PREFIX,
    DOMAIN_NAME: process.env.DOMAIN_NAME,
    email,
    token,
    emailEncoded,
    name,
    verifyAdditionalUrlParams: "",
    code,
    quoteText: quote.quote,
    quoteAuthor: quote.author,
  };

  if (comment && commentIdea) {
    const ideaURLPath = `/i/${commentIdea.shortId.S}/${commentIdea.slug.S}`;
    templateParams.verifyAdditionalUrlParams = `&fc=1&next=${encodeURIComponent(
      `${ideaURLPath}?aa=itc&tci=${comment.commentId.S}`
    )}`;
    templateParams.commentText = comment.body.S;
    templateParams.ideaHref = `https://${templateParams.DOMAIN_NAME}${ideaURLPath}`;
    templateParams.ideaName = comment.ideaName.S;
  } else if (ideaToSave || ideaToLike) {
    const idea = ideaToSave || ideaToLike;

    let aa = 'si';

    if(ideaToLike) {
      aa = 'li';
    }

    try {
      const ideaURLPath = `/i/${idea.shortId.S}/${idea.slug.S}`;
      templateParams.verifyAdditionalUrlParams = `&fis=1&next=${encodeURIComponent(
        `${ideaURLPath}?aa=${aa}`
      )}`;
      templateParams.ideaHref = `https://${templateParams.DOMAIN_NAME}${ideaURLPath}`;
      templateParams.ideaName = idea.title.S;
    } catch (err) {
      console.log(JSON.stringify(err, null, ""));
    }
  } else if(next){
    templateParams.verifyAdditionalUrlParams = `&next=${encodeURIComponent(next)}`;
  }

  const htmlTemplate = getLoginTemplate(firstLogin, !!comment, !!(ideaToSave || ideaToLike), isMobile, next === '/ideas/create');

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

async function updateLoginCode(docClient, id) {
  const code = Math.round(Math.random()* 10000).toString().padStart(4, '0')
  const date = (new Date()).toISOString()

  await docClient.update({
    TableName: process.env.USERS_TABLE_NAME,
    Key: {
      userId: id,
    },
    UpdateExpression: "SET loginCode = :code, loginCodeDate = :date",
    ExpressionAttributeValues: {
      ':code': code,
      ':date': date,
    },
  }).promise()

  return code
}

// This is your common handler, no way different than what you are used to do every day
// in AWS Lambda
const sendMail = async (event, context) => {
  const { email, commentId, ideaToLikeId, ideaToSaveId, next, isMobile } = event.body;
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
      const code = isMobile ? (await updateLoginCode(docClient, result.Items[0].userId)) : null
      await setDefaultAvatar(docClient, result.Items[0])

      const sendMailResp = await sendEmail(
        email,
        token,
        name,
        commentId,
        ideaToSaveId,
        ideaToLikeId,
        next,
        context,
        code,
        isMobile
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
