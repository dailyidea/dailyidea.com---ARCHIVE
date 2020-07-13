const withSentry = require('serverless-sentry-lib')
const AWS = require('aws-sdk')
const dayjs = require('dayjs')
const jwt = require('jsonwebtoken')

async function getUser (email) {
  const docClient = new AWS.DynamoDB.DocumentClient()

  const result = await docClient
    .query({
      TableName: process.env.USERS_TABLE_NAME,
      IndexName: 'emailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    })
    .promise()
  console.log(result)

  if (result.Count === 0) {
    throw Error('Email not found')
  }

  return result.Items[0]
}


async function revomeLoginCode(id) {
  const docClient = new AWS.DynamoDB.DocumentClient()

  await docClient.update({
    TableName: process.env.USERS_TABLE_NAME,
    Key: {
      userId: id,
    },
    UpdateExpression: "REMOVE loginCode, loginCodeDate",
  }).promise()
}


function errorResponse (message, code = 'ERROR') {
  return {
    statusCode: 400,
    body: JSON.stringify({ result: 'error', code, message }),
  }
}

const generateToken = function (email) {
  return jwt.sign(
    {
      email,
    },
    process.env.SECRET_TOKEN,
    { expiresIn: '1h' },
  )
}

exports.handler = withSentry(async (event, context) => {
  const { email, code } = event.body
  let user

  if (! /^\d{4}$/.test(code)) {
    return errorResponse('Login code must be exactly 4 digits', 'INVALID')
  }

  try {
    user = await getUser(email)
  } catch (e) {
    return errorResponse(e.message, 'NOT_FOUND')
  }

  if (! user.loginCode) {
    // Maybe report to sentry?
    return errorResponse('Login was not requested', 'NOT_REQUESTED')
  }

  if (user.loginCode !== code) {
    return errorResponse('Wrong login code', 'WRONG_CODE')
  }

  const loginCodeDate = dayjs(user.loginCodeDate)
  if (loginCodeDate.isValid() && dayjs().diff(loginCodeDate, 'minutes') > 15) {
    return errorResponse('Code expired', 'EXPIRED')
  }

  await revomeLoginCode(user.userId)

  return { body: JSON.stringify({ token: generateToken(email) }) }
})
