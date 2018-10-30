import attachCognitoModule from '@vuetify/vuex-cognito-module'
import fetch from 'node-fetch'
import Amplify from '@aws-amplify/core'
import API from '@aws-amplify/api'
global.fetch = global.fetch || fetch

export default (ctx, inject) => {
  const store = ctx.store

  class AmplifyStorage {
    // set item with the key
    setItem(key, value) {
      return ctx.app.$storage.setUniversal(key, value)
    }
    // get item with the key
    getItem(key) {
      return ctx.app.$storage.getUniversal(key)
    }
    // remove item with the key
    removeItem(key) {
      return ctx.app.$storage.removeUniversal(key)
    }
    // clear out the storage
    clear() {
      // console.log('clear')
    }
  }
  const amplifyStorage = new AmplifyStorage()
  inject('amplifyStorage', amplifyStorage)

  attachCognitoModule(
    store,
    {
      userPoolId: process.env.COGNITO_POOL_ID,
      identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
      userPoolWebClientId: process.env.COGNITO_POOL_WEB_CLIENT_ID,
      region: process.env.AWS_REGION,
      storage: amplifyStorage
    },
    'cognito'
  )

  Amplify.register(API)
  const aws_config = {
    aws_appsync_graphqlEndpoint: process.env.APPSYNC_ENDPOINT,
    aws_appsync_region: process.env.AWS_REGION,
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    endpoints: [
      {
        name: 'RequestLogin',
        endpoint: process.env.REQUEST_LOGIN_ENDPOINT
      }
    ]
  }

  inject('amplifyApi', API)

  Amplify.API.configure(aws_config)
}
