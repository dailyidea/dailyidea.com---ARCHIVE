<template>
  <div id="commonHeader" hidden :class="{ 'grey-bg': greyBg }">
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

    <slot name="header"></slot>

    <!-- Router contents -->
    <div class="content-container">
      <v-main class="nuxtContainer">
        <v-layout>
          <v-flex>
            <slot />
          </v-flex>
        </v-layout>
        <vue-snotify />
      </v-main>
    </div>

    <div v-if="!hideMobileNav" class="hidden-md-and-up sticky-footer">
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
    greyBg: { type: Boolean, default: false },
    hideMobileNav: { type: Boolean, default: Boolean }
  },

  data() {
    return { searchIdeaMode: false }
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

  methods: {
    signOut() {
      this.$store.dispatch('cognito/signOut')
      setTimeout(() => {
        this.$store.commit('userData/resetUserData')
      }, 300)

      // Redirect user to home page after logout
      this.$router.push({ name: 'index' })
    }
  }
}
</script>

<style lang="scss">
.content-container {
  margin: 2vw;
}

.overlay {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;

  @media (min-width: $screen-md-min) {
    align-items: center;
  }

  .overlay-card {
    width: 70%;
    margin: 0 auto;
    padding-top: 3rem;
    @media (max-width: $screen-sm-max) {
      width: 95%;
      overflow-y: auto;
    }
  }
}

.v-toolbar__content {
  width: 100%;
}

@media (max-width: $screen-sm-max) {
  .sticky-footer {
    display: flex;
    align-items: center;
    border-top: 2px solid $secondary-color;
    position: fixed;
    bottom: 0;
    z-index: 101;
    width: 100%;

    .mobile {
      height: 75px !important;
    }
  }
}

.grey-bg {
  background-color: $background-grey;
}

#commonHeader {
  height: 100%;
  position: relative;

  .loggedInHeader {
    position: relative;
    z-index: 1;
    width: 100%;
    background: white !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
}
</style>
