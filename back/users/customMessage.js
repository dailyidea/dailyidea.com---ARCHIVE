var querystring = require("querystring");

exports.handler = (event, context, callback) => {
  if (event.triggerSource === 'CustomMessage_SignUp') {
    console.log(event.request.userAttributes.email)
    event.response.emailSubject = "[Daily Idea] Please confirm your email address :)";
    event.response.emailMessage = `<strong>Hi! Welcome to Daily Idea.</strong><br/>\n` +
      `To complete your signup, just click this button to confirm your email address:<br/>\n` +
      `Alternatively visit this url in a browser: https://${process.env.DOMAIN_NAME}/auth/signup/confirm?code=${event.request.codeParameter}&username=${querystring.escape(event.request.userAttributes.email)}<br/>\n` +
      `We're excited to be with you on your journey as you start logging your ideas every day!<br/>\n` +
      `--Daily Idea`

  }
  context.done(null, event)
}
