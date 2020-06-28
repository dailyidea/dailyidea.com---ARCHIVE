<template>
  <div id="commonHeader" hidden>
    <v-progress-linear
      :indeterminate="true"
      :active="progressBarActive"
      :height="2"
      style="z-index: 999"
      absolute
    ></v-progress-linear>
    <template>
      <navigation-menu
        v-if="!hideSlideMenu"
        ref="sideMenu"
        @signOut="signOut"
      ></navigation-menu>
      <div class="loggedInHeader">
        <desktop-header @signOut="signOut"></desktop-header>
        <mobile-header @showSideMenu="showSideMenu"></mobile-header>
      </div>
    </template>

    <!-- Router contents -->
    <v-container>
      <v-content class="nuxtContainer">
        <v-layout>
          <v-flex>
            <slot />
          </v-flex>
        </v-layout>
        <vue-snotify />
      </v-content>
    </v-container>
  </div>
</template>

<script>
import NavigationMenu from './NavigationMenu'
import DesktopHeader from './DesktopHeader'
import MobileHeader from './MobileHeader'

export default {
  components: { MobileHeader, NavigationMenu, DesktopHeader },
  props: {
    hideSlideMenu: Boolean
  },
  data() {
    return {
      searchIdeaMode: false
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.userData.isAuthenticated
    },
    progressBarActive() {
      return this.$store.getters['layoutState/progressBarActive']
    }
  },
  mounted() {
    this.$el.removeAttribute('hidden')
  },
  created() {},
  methods: {
    initFacebookChat() {
      window.fbAsyncInit = function() {
        // eslint-disable-next-line
                  FB.init({
          xfbml: true,
          version: 'v6.0'
        })
      }
      ;(function(d, s, id) {
        // eslint-disable-next-line
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return
        js = d.createElement(s)
        js.id = id
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js'
        fjs.parentNode.insertBefore(js, fjs)
      })(document, 'script', 'facebook-jssdk')
    },
    showSideMenu() {
      if (!this.$refs.sideMenu) {
        return
      }
      this.$refs.sideMenu.show()
    },
    signOut() {
      this.$store.dispatch('cognito/signOut')
      setTimeout(() => {
        this.$store.commit('userData/resetUserData')
      }, 300)

      // Redirect user to home page after logout
      this.$router.push({
        name: 'index'
      })
    }
  }
}
</script>

<style lang="scss">
#commonHeader {
  position: relative;
  .loggedInHeader {
    width: 100%;
    background: white !important;
  }
}
</style>
