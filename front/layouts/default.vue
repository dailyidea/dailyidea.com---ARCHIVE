<template>
  <v-app id="app">
    <v-toolbar class="toolBar" app flat absolute>
      <v-toolbar-title class="blue--text subheading">
        <nuxt-link :to="{ name: 'index' }">
          <strong class="pl-3">Daily Idea</strong>
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer />
      <template v-if="!$store.getters['cognito/isLoggedIn']">
        <nuxt-link class="helpLink" :to="{ name: 'auth-login' }"
          >Help</nuxt-link
        >
        <nuxt-link class="userLink" :to="{ name: 'auth-signup' }">
          <v-icon>fa-user</v-icon>
        </nuxt-link>
      </template>
      <template v-else>
        <a @click="logout">Logout</a>
      </template>
    </v-toolbar>
    <v-content>
      <v-layout>
        <v-flex>
          <nuxt />
        </v-flex>
      </v-layout>
      <vue-snotify />
    </v-content>
    <!-- <v-footer app>
      <span>Dailyidea &copy; 2018</span>
    </v-footer> -->
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
<style lang="scss">
#app {
  .toolBar {
    background: white !important;
    color: #c0b7c5 !important;
    font-style: none !important;
    text-decoration: none !important;
    .helpLink {
      color: #c0b7c5 !important;
      font-style: none !important;
      text-decoration: none !important;
    }

    i {
      color: #c0b7c5 !important;
      font-style: none !important;
      text-decoration: none !important;
      font-size: 15px !important;
      margin-left: 17px;
    }
  }
}
</style>
