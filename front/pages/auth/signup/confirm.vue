<template>
  <v-container>
    <v-layout row>
      <v-flex>
        <p class="title">Daily Idea</p>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex>
        <p>{{ error }}</p>
        <nuxt-link :to="{name: 'auth-signup-resend'}">Resend Confirmation Email</nuxt-link>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    error: 'This confirmation link is not valid'
  }),
  async asyncData({ store, route, redirect }) {
    const code = route.query.code
    const username = route.query.username
    try {
      await store.dispatch('cognito/confirmUser', {
        username,
        code
      })
      redirect({ name: 'auth-signup-confirmation' })
    } catch (e) {
      return {
        error: e.message
      }
    }
  }
}
</script>
