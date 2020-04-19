<template>
  <v-toolbar class="desktop hidden-sm-and-down" flat color="white">
    <!-- Left Title Side - Desktop -->

    <!--    <v-spacer></v-spacer>-->
    <v-container fluid>
      <v-row>
        <v-col>
          <v-toolbar-title>
            <!-- Logo on top left corner -->
            <nuxt-link class="logoLink" :to="logoLink">
              <img class="logoIcon" src="~/assets/images/logo_icon.svg" />
              <img
                class="logoIcon logoText"
                src="~/assets/images/logo_text.svg"
              />
            </nuxt-link>
          </v-toolbar-title>
        </v-col>
        <v-col style="text-align: center; line-height: 38px">
          <v-text-field
            v-if="searchIdeaMode"
            v-model="label"
            label="What are you looking for?"
            solo
            dense
            autofocus
            hide-details
          >
            <template v-slot:append>
              <v-icon @click="searchIdeaMode = false">fa-times</v-icon>
            </template>
            <template v-slot:prepend-inner>
              <v-icon size="22" @click="searchIdeaMode = false"
                >fa-search</v-icon
              >
            </template>
          </v-text-field>
          <template v-else>
            <span class="ideas-navigation-item">
              <router-link to="/ideas/all">All Ideas</router-link>
            </span>
            <span v-if="isAuthenticated" class="ideas-navigation-item">
              <router-link to="/ideas/me">My Ideas</router-link>
            </span>
            <span v-if="isAuthenticated" class="ideas-navigation-item">
              <router-link to="/ideas/liked">Saved Ideas</router-link>
            </span>
          </template>
        </v-col>
        <v-col style="text-align: right">
          <v-btn
            icon
            height="36"
            width="36"
            :input-value="searchIdeaMode"
            @click="searchIdeaMode = !searchIdeaMode"
          >
            <v-icon size="18" color="#5a5a5a">fas fa-search</v-icon>
          </v-btn>

          <!-- Profile Icon -->
          <v-menu offset-y nudge-bottom="15" left :disabled="!isAuthenticated">
            <template v-slot:activator="{ on }">
              <a v-if="isAuthenticated" v-on="on">
                <span
                  v-if="!userAvatar"
                  class="profileBtn"
                  icon
                  fab
                >
                  <v-icon>mdi-account-circle</v-icon>
                </span>
                <span
                  v-else
                  class="userAvatarContainer"
                  :style="avatarStyle"
                ></span>
                <span class="userName">{{ userName }}</span>
              </a>
              <router-link v-else
                :to="{ name: 'auth-login' }"
                >Log In
              </router-link>
            </template>
            <v-list>
              <router-link to="/profile">
                <v-list-item>
                  <v-list-item-title>My Profile</v-list-item-title>
                </v-list-item>
              </router-link>

              <router-link to="/settings">
                <v-list-item>
                  <v-list-item-title>Settings</v-list-item-title>
                </v-list-item>
              </router-link>
              <v-list-item @click="signOut">
                <v-list-item-title>Sign Out</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
  </v-toolbar>
</template>

<script>
export default {
  name: 'DesktopHeader',
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
    }
  }
}
</script>

<style scoped lang="scss">
a {
  text-decoration: none;
}

.ideas-navigation-item {
  &:not(:last-child) {
    @media (min-width: $screen-md-min) and (max-width: $screen-md-max) {
      margin-right: 18px;
    }
    @media (min-width: $screen-lg-min) {
      margin-right: 40px;
    }
  }

  a {
    color: #9f9f9f;

    &.nuxt-link-active {
      color: $primary-color;
      border-bottom: 2px solid $primary-color;
    }
  }
}

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

  // For non loggedin user

  .logoLink {
    text-decoration: none;

    .logoIcon {
      height: 24px;
    }

    .logoText {
      margin-bottom: 5px;
      margin-left: 5px;
      height: 13px;
    }
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
