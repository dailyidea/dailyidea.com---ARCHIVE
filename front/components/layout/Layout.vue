<template>
  <div id="commonHeader">

    <!-- Non login page header -->
    <v-toolbar v-if="!$store.getters['cognito/isLoggedIn']" class="toolBar" app flat absolute>

      <v-toolbar-title class="blue--text subheading">
        <nuxt-link class="logoLink" :to="{ name: 'index' }">
          <img class="logoIcon" src="~/assets/images/logo_icon.png" />
          <img class="logoIcon logoText" src="~/assets/images/logo_text.png" />
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer />
      <template>
        <nuxt-link class="helpLink" :to="{ name: 'auth-login' }">Help</nuxt-link>
        <nuxt-link class="userLink" :to="{ name: 'auth-signup' }">
          <v-icon>fa-user</v-icon>
        </nuxt-link>
      </template>
    </v-toolbar>

    <!-- Loggedin page header -->
    <template v-else>
      <loggedInDesktopHeader v-bind="{backButton: backButton}"></loggedInDesktopHeader>
    </template>

    <!-- Router contents -->
    <v-content class="nuxtContainer">
      <v-layout>
        <v-flex>
          <slot />
        </v-flex>
      </v-layout>
      <vue-snotify />
    </v-content>

    <!-- Footer -->
    <!-- <v-footer app>
      <span>Dailyidea &copy; 2018</span>
    </v-footer>-->

  </div>
</template>
<script>
import loggedInDesktopHeader from '~/components/loggedInDesktopHeader'

export default {
  components: { loggedInDesktopHeader },
  props: {
    backButton: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('cognito/signOut')
    }
  },
  created() {
    console.log('at main params =>', this.backButton)
  }
}
</script>
<style lang="scss">
.commonHeader {
  .toolBar {
    display: none;
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

    .logoLink {
      text-decoration: none;
      display: none;
      .logoIcon {
        height: 24px !important;
        display: none;
      }

      .logoText {
        margin-top: 4px;
        height: 19px;
      }
    }
  }
}
</style>