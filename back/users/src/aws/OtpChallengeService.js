const AWS = require('aws-sdk')

const generateToken = function () {
  return Math.random().toString(36).substring(7)
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

exports.setupOtpChallenge = function (email, event, context) {
  const token = generateToken()
  console.log(token)
  sendEmail(email, token, event, context)

  event.response.publicChallengeParameters = {}
  event.response.privateChallengeParameters = {}
  event.response.privateChallengeParameters.answer = token
  event.response.challengeMetadata = 'OTP_CHALLENGE'
}

