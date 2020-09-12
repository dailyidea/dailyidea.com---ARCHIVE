<template>
  <v-toolbar class="desktop hidden-sm-and-down" flat color="white">
    <v-container>
      <v-row>
        <v-col cols="auto">
          <v-toolbar-title>
            <!-- Logo on top left corner -->
            <nuxt-link
              class="logo d-flex flex-column justify-center align-center mt-1"
              :to="logoLink"
            >
              <img class="logo__bulb" src="~/assets/images/lamp_on.png" />
              <img class="logo__text" src="~/assets/images/logo_text.png" />
            </nuxt-link>
          </v-toolbar-title>
        </v-col>
        <v-col> </v-col>
        <v-col cols="auto">
          <links></links>
        </v-col>
      </v-row>
    </v-container>
  </v-toolbar>
</template>

<script>
import Links from './Links'

export default {
  name: 'DesktopHeader',
  components: {
    Links
  },
  data() {
    return {
      searchIdeaMode: false,
      label: ''
    }
  },
  computed: {
    userName() {
      return this.$store.getters['userData/userName']
    },

    isAuthenticated() {
      return this.$store.state.userData.isAuthenticated
    },

    logoLink() {
      if (this.isAuthenticated) {
        return { name: 'ideas-all' }
      } else {
        return '/'
      }
    }
  },
  methods: {
    signOut() {
      this.$emit('signOut')
    },
    onToggleSearchIdeaMode(value) {
      this.searchIdeaMode = value
    }
  }
}
</script>

<style scoped lang="scss">
.desktop {
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;

  .backButon {
    margin-right: 20px;
    margin-top: -10px;

    color: $primary-color;
    font-size: 15px;
    line-height: 20px;
    cursor: pointer;
  }

  .logo {
    &__bulb {
      width: 30px;
    }

    &__text {
      width: 90px;
    }
  }
}
</style>
