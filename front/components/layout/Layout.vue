<template>
  <div id="commonHeader">
    <!-- Non login page header -->
    <v-app-bar v-if="!loggedInHeader" app class="toolBar" flat absolute>
      <v-toolbar-title class="blue--text subheading">
        <nuxt-link class="logoLink" :to="{ name: 'index' }">
          <img class="logoIcon" src="~/assets/images/logo_icon.png" />
          <img class="logoIcon logoText" src="~/assets/images/logo_text.png" />
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer />
      <template>
        <nuxt-link class="helpLink" :to="{ name: 'auth-login' }"
          >Help</nuxt-link
        >
        <nuxt-link class="userLink" :to="{ name: 'auth-signup' }">
          <v-icon>fa-user</v-icon>
        </nuxt-link>
      </template>
    </v-app-bar>

    <!-- Loggedin page header -->
    <template v-else-if="$store.getters['cognito/isLoggedIn']">
      <loggedInHeader
        v-bind="{
          backButton: backButton,
          mobileTitle: mobileTitle,
          mobileSearchIcon: mobileSearchIcon,
          mobileHamburger: mobileHamburger
        }"
      >
      </loggedInHeader>
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
import loggedInHeader from '~/components/loggedInHeader'

export default {
  components: { loggedInHeader },
  props: {
    backButton: {
      type: Boolean,
      default: false
    },
    loggedInHeader: {
      type: Boolean,
      default: false
    },
    mobileTitle: {
      type: String,
      default: ''
    },
    mobileHamburger: {
      type: Boolean,
      default: false
    },
    mobileSearchIcon: {
      type: Boolean,
      default: false
    }
  },
  created() {
    console.log('at main params =>', this.backButton)
  },
  methods: {
    logout() {
      this.$store.dispatch('cognito/signOut')
    }
  }
}
</script>
<style lang="scss">
#commonHeader {
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

    .logoLink {
      text-decoration: none;
      .logoIcon {
        height: 24px !important;
      }

      .logoText {
        margin-top: 9px;
        height: 19px;
      }
    }
  }

  .nuxtContainer {
    padding-top: 56px !important;
  }
}
</style>
