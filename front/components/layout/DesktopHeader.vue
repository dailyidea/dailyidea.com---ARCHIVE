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
              <div>
                <a v-if="isAuthenticated" v-on="on">
                <span v-if="!userAvatar" class="profileBtn" icon fab>
                  <v-icon>mdi-account-circle</v-icon>
                </span>
                  <span
                    v-else
                    class="userAvatarContainer"
                    :style="avatarStyle"
                  ></span>
                  <span class="userName">{{ userName }}</span>
                </a>
                <router-link v-else :to="{ name: 'auth-login' }"
                >Log In
                </router-link>
              </div>
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

export default {
  name: 'DesktopHeader',
  components: {
    SearchComponent
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
    userAvatar() {
      return this.$store.getters['userData/avatar']
    },
    avatarStyle() {
      if (!this.userAvatar) {
        return {}
      } else {
        return {
          'background-image': `url(${this.userAvatar})`
        }
      }
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

  .userAvatarContainer {
    display: inline-block;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    vertical-align: middle;
    cursor: pointer;
    transition: opacity 0.2s ease;
    background-color: #ebe7ed;
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
