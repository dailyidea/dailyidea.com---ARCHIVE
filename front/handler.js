// todo https://github.com/nuxt/nuxt.js/issues/3626
const { Nuxt } = require('nuxt-edge/dist/nuxt-start')
const serverless = require('serverless-http')
const express = require('express')
const nuxtConfig = require('./nuxt.config')
//const thundraWarmup = require('@thundra/warmup')
//const optionalCallback = () => console.log('Warming up...')
//const thundraWarmupWrapper = thundraWarmup(optionalCallback)

const config = { dev: false, ...nuxtConfig }
const nuxt = new Nuxt(config)

const app = express()
app.use(nuxt.render)

const handler = serverless(app)

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

exports.render = function(event, context, callback) {
  /** Immediate response for WarmUP plugin */
  if (checkAndHandleWarmupRequest(event, callback)) {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  return handler(event, context, callback)
}
