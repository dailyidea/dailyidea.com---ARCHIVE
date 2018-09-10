import attachCognitoModule from '@vuetify/vuex-cognito-module'

export default ({ store }) => {
  attachCognitoModule(
    store,
    {
      userPoolId: process.env.COGNITO_POOL_ID,
      identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
      userPoolWebClientId: process.env.COGNITO_POOL_WEB_CLIENT_ID,
      region: process.env.AWS_REGION
    },
    'cognito'
  )
}
