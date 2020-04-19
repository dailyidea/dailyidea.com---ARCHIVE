<template>
  <v-navigation-drawer
    v-model="showSideMenu"
    class="sidebarMenu"
    absolute
    temporary
  >
    <div class="logo-container">
      <v-icon small class="logo-container__icon" @click.native="close"
        >fa-times</v-icon
      >
      <span class="logo-container__text">DAILYIDEA</span>
    </div>

    <v-list dense dark>
      <v-list-item @click.native="openPage('/ideas/all')"
      active-class="highlighted"
      :class="'/ideas/all' === $route.path ? 'highlighted' : ''"
      >
        <v-list-item-content>
          <v-list-item-title><v-icon small>mdi-lightbulb-on</v-icon>All Ideas</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
      v-if="isAuthenticated" @click.native="openPage('/ideas/me')"
      active-class="highlighted"
      :class="'/ideas/me' === $route.path ? 'highlighted' : ''"
      >
        <v-list-item-content>
          <v-list-item-title><v-icon small>mdi-head-lightbulb</v-icon>My Ideas</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-if="isAuthenticated"
        @click.native="openPage('/ideas/liked')"
        active-class="highlighted"
      :class="'/ideas/liked' === $route.path ? 'highlighted' : ''"
      >
        <v-list-item-content>
          <v-list-item-title><v-icon small>mdi-bookmark</v-icon>Saved Ideas</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="isAuthenticated" @click.native="openPage('/profile')"
      active-class="highlighted"
      :class="'/profile' === $route.path ? 'highlighted' : ''"
      >
        <v-list-item-content>
          <v-list-item-title><v-icon small>mdi-account-circle</v-icon>My Profile</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="isAuthenticated" @click.native="openPage('/settings')"
      active-class="highlighted"
      :class="'/settings' === $route.path ? 'highlighted' : ''"
      >
        <v-list-item-content>
          <v-list-item-title><v-icon small>mdi-cog</v-icon>Settings</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="isAuthenticated" @click.native="signOut">
        <v-list-item-content>
          <v-list-item-title><v-icon small>mdi-exit-run</v-icon>Sign Out</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-if="!isAuthenticated"
        @click.native="openPage('/auth/login')"
        active-class="highlighted"
      :class="'/auth/login' === $route.path ? 'highlighted' : ''"
      >
        <v-list-item-content>
          <v-list-item-title>Log In</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-if="!isAuthenticated"
        @click.native="openPage('/auth/signup')"
        active-class="highlighted"
      :class="'/auth/signup' === $route.path ? 'highlighted' : ''"
      >
        <v-list-item-content>
          <v-list-item-title>Sign Up</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'SiteNavigation',
  data() {
    return {
      showSideMenu: false
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.userData.isAuthenticated
    }
  },
  methods: {
    close() {
      this.showSideMenu = false
    },
    openPage(to) {
      this.showSideMenu = false
      this.$router.push(to)
    },
    signOut() {
      this.showSideMenu = false
      this.$emit('signOut')
    },
    show() {
      this.showSideMenu = true
    }
  }
}
</script>

<style scoped lang="scss">
.sidebarMenu {
  background: $primary-color !important;
  z-index: 999;

  .logo-container {
    margin-top: 18px;
    padding-left: 28px;
    margin-bottom: 1rem;

    &__text {
      vertical-align: top;
      line-height: 22px;
      font-size: 14px;
      letter-spacing: 0.6rem;
    }

    &__icon {
      margin-right: 16px;
      vertical-align: baseline;
      cursor: pointer;
    }
  }

  // display: none;
  .v-list-item {
    cursor: pointer;

    i.v-icon {
      vertical-align: baseline;
      margin-right: 0.5rem;
    }

    &:hover,
    &:active {
      background-color: $secondary-color !important;
    }

    .v-list-item__content {
      margin: 10px 0 !important;
      .nuxt-link-exact-active.nuxt-link-active {
        text-decoration: none;
      }

      .v-list-item__title {
        font-size: 16px;
        line-height: normal !important;
        color: white;
      }
    }
  }
}
.highlighted {
  border-left: 4px solid $secondary-color;

  .v-list-item__title,
  .v-list-item__title i.v-icon {
    color: $secondary-color !important;
  }
}
</style>
