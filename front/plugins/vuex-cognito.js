import attachCognitoModule from '@vuetify/vuex-cognito-module'
import fetch from 'node-fetch'
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
}
