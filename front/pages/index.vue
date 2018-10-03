<template>
  <v-card>
    <v-card-title>Daily Idea</v-card-title>
    <v-card-text>
      <p>Every day, log an idea.</p>
      <p>A project idea, a startup idea, a work idea.</p>
      <p>You'll get an email in your inbox reminding you to submit an idea. Just respond to it and we'll  save it for you.</p>
      <v-btn :to="{name: 'auth-signup'}">Sign Up</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('cognito/signOut')
    }
  }
}
</script>
