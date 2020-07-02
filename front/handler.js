// todo https://github.com/nuxt/nuxt.js/issues/3626
const { Nuxt } = require('nuxt-start-edge')

const serverless = require('serverless-http')

const nuxtConfig = require('./nuxt.config')

const config = { dev: false, ...nuxtConfig }
const nuxt = new Nuxt(config)

let handler

const serialize = function(obj) {
  const str = []
  for (const p in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }
  return str.join('&')
}

exports.render = function(event, context, callback) {
  if (event.requestContext && event.requestContext.domainName) {
    const domainName = event.requestContext.domainName
    if (domainName === 'dailyidea.com') {
      const path = event.path
      let querystring = ''
      if (event.queryStringParameters) {
        querystring = `?${serialize(event.queryStringParameters)}`
      }
      const locationToRedirect = `https://www.dailyidea.com${path}${querystring}`
      const response = {
        statusCode: 301,
        headers: {
          Location: locationToRedirect
        },
        body: ''
      }
      callback(null, response)
      return
    }
  }

  if (!handler) {
    return nuxt.ready().then(() => {
      handler = serverless(nuxt.render, {
        callbackWaitsForEmptyEventLoop: false
      })
      return handler(event, context, callback)
    })
  } else {
    return handler(event, context, callback)
  }
}
