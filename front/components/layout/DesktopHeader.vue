<template>
  <v-toolbar class="desktop hidden-sm-and-down elevation-1" flat color="white">
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
        <v-col>
          <search-component
            :search-idea-mode="searchIdeaMode"
            :label="label"
            @onToggleSearchIdeaMode="onToggleSearchIdeaMode"
          ></search-component>
        </v-col>
        <v-col cols="auto d-flex flex-row align-center justify-space-between">
          <nuxt-link
            class="link"
            :class="{ active: page === 'explore' }"
            :to="{ name: 'ideas-all' }"
          >
            <img
              v-if="page === 'explore'"
              class="active-bulb"
              src="~/assets/images/navbar/bulb-active.svg"
            />
            <img v-else src="~/assets/images/navbar/bulb.svg" />
            <span class="link-text">
              <span class="text-shadow"></span>
              <span class="text">Explore</span>
            </span>
          </nuxt-link>
          <nuxt-link
            class="link"
            :class="{ active: page === 'post' }"
            :to="{ name: 'ideas-create' }"
          >
            <img
              v-if="page === 'post'"
              src="~/assets/images/navbar/post-active.svg"
            />
            <img v-else src="~/assets/images/navbar/post.svg" />
            <span class="link-text">
              <span class="text-shadow"></span>
              <span class="text">Post</span>
            </span>
          </nuxt-link>
          <nuxt-link
            class="link"
            :class="{ active: page === 'profile' }"
            :to="{ name: 'ideas-me' }"
          >
            <img
              v-if="page === 'profile'"
              src="~/assets/images/navbar/profile-active.svg"
            />
            <img v-else src="~/assets/images/navbar/profile.svg" />
            <span class="link-text">
              <span class="text-shadow"></span>
              <span class="text">My Ideas</span>
            </span>
          </nuxt-link>
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
      label: '',
      pages: {
        '/ideas/all': 'explore',
        '/ideas/me': 'profile',
        '/ideas/create': 'post'
      }
    }
  },
  computed: {
    page() {
      return this.pages[this.$route.path]
    },

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

  .link {
    text-decoration: none;
    color: black;
    display: flex;
    align-items: center;
    padding: 1rem;

    img {
      height: 20px;
      padding-right: 10px;
    }
  }

  .active {
    color: $primary-color;
    border-bottom: 3px solid $secondary-color;
    height: 100%;
    .link-text {
      position: relative;
      .text-shadow {
        position: absolute;
        height: 50%;
        width: 100%;
        background-color: $primary-color;
        opacity: 0.2;
        bottom: 0;
      }
    }

    .active-bulb {
      height: 25px;
    }
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
