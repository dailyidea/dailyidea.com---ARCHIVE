<template>
  <v-card>
    <v-card-text>
      <template v-if="!$store.getters['cognito/isLoggedIn']">
        <nuxt-link :to="{name :'auth-login'}">Login</nuxt-link>
        <br>
        <nuxt-link :to="{name :'auth-signup'}">Signup</nuxt-link>
      </template>
      <template v-else>
        <a @click="logout">Logout</a>
      </template>
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
