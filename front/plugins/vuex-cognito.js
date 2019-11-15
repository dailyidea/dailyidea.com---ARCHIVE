import Amplify from '@aws-amplify/core'
import API from '@aws-amplify/api'
import attachCognitoModule from '~/module/vuex-cognito-module.esm.js'

export default (ctx, inject) => {
  const store = ctx.store

  class AmplifyStorage {
    static syncPromise = null
    // set item with the key
    static setItem(key, value) {
      return ctx.app.$storage.setUniversal(key, value)
    }
    // get item with the key
    static getItem(key) {
      return ctx.app.$storage.getUniversal(key)
    }
    // remove item with the key
    static removeItem(key) {
      return ctx.app.$storage.removeUniversal(key)
    }
    // clear out the storage
    static clear() {}
  }
  inject('amplifyStorage', AmplifyStorage)

  attachCognitoModule(
    store,
    {
      userPoolId: process.env.COGNITO_POOL_ID,
      identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
      userPoolWebClientId: process.env.COGNITO_POOL_WEB_CLIENT_ID,
      region: process.env.AWS_REGION,
      storage: AmplifyStorage
    },
    'cognito'
  )

  Amplify.register(API)

  const awsConfig = {
    aws_appsync_graphqlEndpoint: process.env.APPSYNC_ENDPOINT,
    aws_appsync_region: process.env.AWS_REGION,
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    aws_appsync_apiKey: process.env.APPSYNC_API_KEY,
    endpoints: [
      {
        name: 'RequestLogin',
        endpoint: process.env.REQUEST_LOGIN_ENDPOINT
      }
    ]
  }

  inject('amplifyApi', API)

  Amplify.API.configure(awsConfig)
}
