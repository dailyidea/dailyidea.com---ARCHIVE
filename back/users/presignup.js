exports.handler = (event, context, callback) => {
  event.response.autoConfirmUser = true
  context.done(null, event)
}
