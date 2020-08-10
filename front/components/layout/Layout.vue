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
      <div class="loggedInHeader hidden-sm-and-down">
        <desktop-header @signOut="signOut"></desktop-header>
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

    <div class="hidden-md-and-up sticky-footer d-flex align-center">
      <mobile-header class="mobile"></mobile-header>
    </div>
  </div>
</template>

<script>
import DesktopHeader from './DesktopHeader'
import MobileHeader from './MobileHeader'

export default {
  components: { MobileHeader, DesktopHeader },
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
        if (d.getElementById(id)) {
          return
        }
        js = d.createElement(s)
        js.id = id
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js'
        fjs.parentNode.insertBefore(js, fjs)
      })(document, 'script', 'facebook-jssdk')
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
.v-toolbar__content {
  width: 100%;
}

@media (max-width: $screen-sm-max) {
  .sticky-footer {
    border-top: 2px solid $secondary-color;
    position: fixed;
    bottom: 0;
    z-index: 2;
    width: 100%;
    margin-top: 5em;

    .mobile {
      height: 75px !important;
    }
  }
}

#commonHeader {
  @media (max-width: $screen-sm-max) {
    padding-bottom: 5em;
  }

  position: relative;
  .loggedInHeader {
    width: 100%;
    background: white !important;
  }
}
</style>
