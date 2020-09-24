<template>
  <v-toolbar class="desktop-sub d-md-none d-lg-flex" flat color="white">
    <v-container>
      <v-row>
        <v-col>
          <span class=" d-flex flex-row align-center justify-start">
            <nuxt-link class="link active" :to="{ name: 'ideas-all' }">
              <link-text active="active" text="Recommended"></link-text>
            </nuxt-link>

            <nuxt-link
              class="link hidden-sm-and-down"
              :to="{ name: 'ideas-all' }"
            >
              <span :class="{ 'link-highlight': page === 'explore' }"
                >Following</span
              >
            </nuxt-link>

            <nuxt-link
              class="link hidden-sm-and-down"
              :to="{ name: 'ideas-all' }"
            >
              <span>New</span>
            </nuxt-link>

            <nuxt-link
              class="link hidden-sm-and-down"
              :to="{ name: 'ideas-all' }"
            >
              <span>#Products</span>
            </nuxt-link>

            <nuxt-link
              class="link hidden-sm-and-down"
              :to="{ name: 'ideas-all' }"
            >
              <span>#startup Ideas</span>
            </nuxt-link>

            <nuxt-link
              class="link hidden-sm-and-down"
              :to="{ name: 'ideas-all' }"
            >
              <span>#cloud</span>
            </nuxt-link>

            <nuxt-link
              class="link hidden-sm-and-down"
              :to="{ name: 'ideas-all' }"
            >
              <span>#music</span>
            </nuxt-link>
          </span>
        </v-col>

        <v-col cols="auto">
          <span class=" d-flex flex-row align-center justify-space-between">
            <nuxt-link
              class="link active mx-4 hidden-sm-and-down"
              :to="{ name: 'auth-login' }"
            >
              <span class="link-highlight">Login</span>
            </nuxt-link>

            <v-btn to="/auth/signup" dark>Sign Up</v-btn>
          </span>
        </v-col>
      </v-row>
    </v-container>
  </v-toolbar>
</template>

<script>
export default {
  name: 'DesktopSubHeader',
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
.desktop-sub {
  width: 100%;
  margin-top: 3px;
  box-shadow: inset 0px 7px 10px -5px rgba(0, 0, 0, 0.1);

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

.link {
  cursor: pointer;
  text-decoration: none;
  color: black;
  display: flex;
  align-items: center;
  @media (min-width: $screen-md-min) {
    padding: 1.1rem;
  }

  @media (max-width: $screen-sm-max) {
    flex-direction: column;
  }
}

.active {
  @media (min-width: $screen-md-min) {
    border-bottom: 3px solid $secondary-color;
  }
  height: 100%;
}
</style>
