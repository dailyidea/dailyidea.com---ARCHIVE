<template>
  <v-container>
    <v-layout row>
      <v-flex
        ><p>Every day, log an idea.</p>
        <p>A project idea, a startup idea, a work idea.</p>
        <p>
          You'll get an email in your inbox reminding you to submit an idea.
          Just respond to it and we'll save it for you.
        </p></v-flex
      >
    </v-layout>
    <v-layout row>
      <v-flex>
        <v-btn :to="{ name: 'auth-signup' }">Sign Up</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  fetch({ store, redirect }) {
    if (store.getters['cognito/isLoggedIn']) {
      redirect({ name: 'ideas' })
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('cognito/signOut')
    }
  }
}
</script>
