<template>
  <v-form>
    <v-container>
      <v-layout row>
        <v-flex />
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
// import Auth from '@aws-amplify/auth'
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js'

export default {
  data: () => ({
    error: ''
  }),
  async mounted() {
    const userPoolData = {
      UserPoolId: process.env.COGNITO_POOL_ID,
      ClientId: process.env.COGNITO_POOL_WEB_CLIENT_ID,
      Storage: this.$amplifyStorage
    }

    const userPool = new CognitoUserPool(userPoolData)

    const userData = {
      Username: this.$storage.getUniversal('username'),
      Pool: userPool,
      Storage: this.$amplifyStorage
    }
    const user = new CognitoUser(userData)
    user.Session = this.$storage.getUniversal('amplifySession')
    try {
      await this.$store.dispatch('cognito/answerCustomChallenge', {
        user,
        answer: this.code
      })
    } catch (e) {
      this.error = e.message
    }
    this.$router.replace({ name: 'ideas' })
  },
  methods: {
    async login() {}
  }
}
</script>
