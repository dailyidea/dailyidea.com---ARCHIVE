const AWS = require('aws-sdk')
const jwt = require('jsonwebtoken')

const generateToken = function (email) {
  return jwt.sign({
    email: email
  }, process.env.SECRET_TOKEN, { expiresIn: '1h' })
}

const sendEmail = function (email, token, event, context) {
  const ses = new AWS.SES({
    region: process.env.SES_REGION
  })
  const eParams = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Html: {
          Data: `<strong>Log In</strong><br>
Hi!<br>
We received a request to log in to your Daily Idea account ${email}. Click this button to log in:<br>

Alternatively visit this url in a browser: https://${process.env.DOMAIN_NAME}/auth/login/verify?otp=${token} <br>
If you did not request this, you can ignore this email! The only way anybody can log in to your account is via links sent to your email (${email}). 
`
        }
      },
      Subject: {
        Data: `[Daily Idea] Log in link for ${email}`
      }
    },
    //environment variable
    Source: process.env.SOURCE_EMAIL
  }

  ses.sendEmail(eParams, function (err, data) {
    if (err) {
      console.log('err', err)
      context.fail(err)
    } else {
      console.log('succc')
      context.succeed(event)
    }
  })
}

exports.handler = (event, context, callback) => {
  const token = generateToken(event.email)
  sendEmail(event.email, token, event, context)
}
