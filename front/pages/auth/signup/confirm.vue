<template>
  <v-container>
    <v-layout row>
      <v-flex>
        <p class="title">Daily Idea</p>
        <p class="title">Invalid Confirmation Link!</p>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex>
        <p>This confirmation link is not valid</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  async fetch({ store, route, redirect }) {
    const code = route.query.code
    const username = route.query.username
    try {
      await store.dispatch('cognito/confirmUser', {
        username,
        code
      })
      redirect({ name: 'auth-signup-confirmation' })
    } catch (e) {
      // pass
    }
  }
}
</script>
