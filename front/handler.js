// todo https://github.com/nuxt/nuxt.js/issues/3626
const { Nuxt } = require('nuxt-start-edge')

const serverless = require('serverless-http')

const nuxtConfig = require('./nuxt.config')
const thundra = require('@thundra/core')({ apiKey: process.env.thundra_apiKey })

const config = { dev: false, ...nuxtConfig }
const nuxt = new Nuxt(config)

function checkAndHandleWarmupRequest(event, callback) {
  // Check whether it is empty request which is used as default warmup request
  if (Object.keys(event).length === 0) {
    console.log(
      'Received warmup request as empty message. ' +
        'Handling with 100 milliseconds delay ...'
    )
    setTimeout(function() {
      callback(null)
    }, 100)
    return true
  } else {
    var isString = typeof event === 'string' || event instanceof String
    if (isString) {
      // Check whether it is warmup request
      if (event.startsWith('#warmup')) {
        var delayTime = 100
        var args = event
          .substring('#warmup'.length)
          .trim()
          .split(/\s+/)
        // Iterate over all warmup arguments
        for (let arg of args) {
          var argParts = arg.split('=')
          // Check whether argument is in key=value format
          if (argParts.length == 2) {
            var argName = argParts[0]
            var argValue = argParts[1]
            // Check whether argument is "wait" argument
            // which specifies extra wait time before returning from request
            if (argName === 'wait') {
              var waitTime = parseInt(argValue)
              delayTime += waitTime
            }
          }
        }
        console.log(
          'Received warmup request as warmup message. ' +
            'Handling with ' +
            delayTime +
            ' milliseconds delay ...'
        )
        setTimeout(function() {
          callback(null)
        }, delayTime)
        return true
      }
    }
    return false
  }
}

let handler = undefined

exports.render = thundra(function(event, context, callback) {
  /** Immediate response for WarmUP plugin */
  if (checkAndHandleWarmupRequest(event, callback)) {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  if (!handler) {
    nuxt.ready().then(() => {
      handler = serverless(nuxt.render, {
        callbackWaitsForEmptyEventLoop: false
      })
      return handler(event, context, callback)
    })
  } else {
    return handler(event, context, callback)
  }
})
