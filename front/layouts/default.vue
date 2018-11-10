<template>
  <v-app>
    <v-toolbar app flat absolute>
      <v-toolbar-title class="blue--text subheading">
        <strong class="pl-3">Daily Idea</strong>
      </v-toolbar-title>
      <v-spacer />
      <template v-if="!$store.getters['cognito/isLoggedIn']">
        <nuxt-link :to="{name :'auth-login'}">Login</nuxt-link>
        <nuxt-link :to="{name :'auth-signup'}" class="pl-3">Signup</nuxt-link>
      </template>
      <template v-else>
        <a @click="logout">Logout</a>
      </template>
    </v-toolbar>
    <v-content>
      <v-container pa-0 justify-center align-center>
        <v-layout>
          <v-flex>
            <nuxt />
          </v-flex>
        </v-layout>
      </v-container>
      <vue-snotify />
    </v-content>
    <v-footer app>
      <span>Dailyidea &copy; 2018</span>
    </v-footer>
  </v-app>
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
