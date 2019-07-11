export default function(context) {
  console.log('Middleware called')
  context.userAgent = process.server
    ? context.req.headers['user-agent']
    : navigator.userAgent
}
