<template>
  <v-toolbar class="desktop hidden-sm-and-down" flat color="white">
    <v-container>
      <v-row>
        <v-col cols="auto">
          <v-toolbar-title>
            <!-- Logo on top left corner -->
            <nuxt-link class="logo" :to="logoLink">
              <img class="logo" src="~/assets/images/logo_full.svg" />
            </nuxt-link>
          </v-toolbar-title>
        </v-col>
        <v-col>
          <search-component
            :search-idea-mode="searchIdeaMode"
            :label="label"
            @onToggleSearchIdeaMode="onToggleSearchIdeaMode"
          ></search-component>
        </v-col>
        <v-col cols="auto">
          <!-- Profile Icon -->
          <v-menu offset-y nudge-bottom="15" left :disabled="!isAuthenticated">
            <template v-slot:activator="{ on }">
              <a v-if="isAuthenticated" v-on="on">
                <header-avatar></header-avatar>
                <span class="userName">{{ userName }}</span>
              </a>
              <router-link
                v-else
                :to="{ name: 'auth-login' }"
                class="text-decoration-none"
              >
                Log In
              </router-link>
            </template>
            <v-list class="header-nav-dropdown">
              <router-link to="/profile">
                <v-list-item>
                  <v-list-item-title
                    ><v-icon small>mdi-account-circle-outline</v-icon> My
                    Profile</v-list-item-title
                  >
                </v-list-item>
              </router-link>

              <router-link to="/settings">
                <v-list-item>
                  <v-list-item-title
                    ><v-icon small>mdi-cog-outline</v-icon>
                    Settings</v-list-item-title
                  >
                </v-list-item>
              </router-link>
              <v-list-item @click="signOut">
                <v-list-item-title
                  ><v-icon small>mdi-exit-run</v-icon> Sign
                  Out</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
  </v-toolbar>
</template>

<script>
import SearchComponent from './SearchComponent'
import HeaderAvatar from './HeaderAvatar'

export default {
  name: 'DesktopHeader',
  components: {
    SearchComponent,
    HeaderAvatar
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
        return { name: 'ideas-me' }
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
  z-index: 100;
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
    height: 32px;
    vertical-align: middle;
  }
}
</style>
