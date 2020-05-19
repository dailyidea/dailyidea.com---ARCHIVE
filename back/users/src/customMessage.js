const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const Sqrl = require("squirrelly");
const withSentry = require("serverless-sentry-lib"); // This helper library

const templatePath = path.join(
  __dirname,
  "../mail-templates/magic_link_template.html"
);
const magicLinkTemplateHTMLTemplateRAw = fs.readFileSync(templatePath, "utf8");

const magicLinkTemplateHTMLCompiled = Sqrl.Compile(
  magicLinkTemplateHTMLTemplateRAw
);

exports.handler = withSentry((event, context, callback) => {
  if (event.triggerSource === "CustomMessage_SignUp") {
    console.log(event.request.userAttributes.email);
    event.response.emailSubject =
      "[Daily Idea] Please confirm your email address :)";
    const renderParams = {
      BUCKET_URL_PREFIX: process.env.BUCKET_URL_PREFIX,
      DOMAIN_NAME: process.env.DOMAIN_NAME,
      codeParameter: event.request.codeParameter,
      emailEncoded: querystring.escape(event.request.userAttributes.email)
    };
    event.response.emailMessage = magicLinkTemplateHTMLCompiled(
      renderParams,
      Sqrl
    );
  }
  context.done(null, event);
});
