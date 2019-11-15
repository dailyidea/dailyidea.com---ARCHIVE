// todo https://github.com/nuxt/nuxt.js/issues/3626
const { Nuxt } = require('nuxt-start-edge')

const serverless = require('serverless-http')

const nuxtConfig = require('./nuxt.config')

const config = { dev: false, ...nuxtConfig }
const nuxt = new Nuxt(config)

let handler

exports.render = function(event, context, callback) {
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
