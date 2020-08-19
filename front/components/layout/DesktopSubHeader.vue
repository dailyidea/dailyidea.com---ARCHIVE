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
              <link-text
                :active="page === 'explore'"
                text="Following"
              ></link-text>
            </nuxt-link>

            <nuxt-link
              class="link hidden-sm-and-down"
              :to="{ name: 'ideas-all' }"
            >
              <link-text text="New"></link-text>
            </nuxt-link>

            <nuxt-link
              class="link hidden-sm-and-down"
              :to="{ name: 'ideas-all' }"
            >
              <link-text text="#Products"></link-text>
            </nuxt-link>

            <nuxt-link
              class="link hidden-sm-and-down"
              :to="{ name: 'ideas-all' }"
            >
              <link-text text="#startup Ideas"></link-text>
            </nuxt-link>

            <nuxt-link
              class="link hidden-sm-and-down"
              :to="{ name: 'ideas-all' }"
            >
              <link-text text="#cloud"></link-text>
            </nuxt-link>

            <nuxt-link
              class="link hidden-sm-and-down"
              :to="{ name: 'ideas-all' }"
            >
              <link-text text="#music"></link-text>
            </nuxt-link>
          </span>
        </v-col>

        <v-col cols="auto">
          <span class=" d-flex flex-row align-center justify-space-between">
            <nuxt-link
              class="link active mx-4 hidden-sm-and-down"
              :to="{ name: 'ideas-all' }"
            >
              <link-text active="active" text="Login"></link-text>
            </nuxt-link>

            <v-btn dark>Sign Up</v-btn>
          </span>
        </v-col>
      </v-row>
    </v-container>
  </v-toolbar>
</template>

<script>
import LinkText from './LinkText.vue'

export default {
  name: 'DesktopSubHeader',
  components: {
    LinkText
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
