import attachCognitoModule from '@vuetify/vuex-cognito-module'
import fetch from 'node-fetch'
global.fetch = global.fetch || fetch

export default ctx => {
  const store = ctx.store

  class NuxtStorage {
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
    static clear() {
      // console.log('clear')
    }
  }

  // TODO https://github.com/vuetifyjs/vuex-cognito-module/pull/4
  attachCognitoModule(
    store,
    {
      userPoolId: process.env.COGNITO_POOL_ID,
      identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
      userPoolWebClientId: process.env.COGNITO_POOL_WEB_CLIENT_ID,
      region: process.env.AWS_REGION,
      storage: NuxtStorage
    },
    'cognito'
  )
}
