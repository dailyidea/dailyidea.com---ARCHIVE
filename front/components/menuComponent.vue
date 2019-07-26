<template>
  <div v-if="visible" id="menuComponent">
    <!-- Right side close button -->
    <div class="topRightCloseBtn" @click="visible = false">
      <i class="fa fa-times"></i>
    </div>

    <!-- Logo -->
    <div class="logoText">
      <span class="dark-font">DAILY</span>
      <span class="light-font">IDEA</span>
    </div>

    <!-- Menu Items -->
    <div class="menuItemsContainer">
      <div class="menuItems">
        <div class="menuItem">
          <nuxt-link to="/ideas">My Ideas</nuxt-link>
        </div>
        <div class="menuItem">
          <nuxt-link to="/ideas">Saved Ideas</nuxt-link>
        </div>
        <div class="menuItem">
          <nuxt-link to="/settings">Settings</nuxt-link>
        </div>
        <div class="menuItem">
          <nuxt-link to="/profile">My Profile</nuxt-link>
        </div>
        <div class="menuItem">
          <nuxt-link to="/ideas">My Groups</nuxt-link>
        </div>
      </div>
      <!-- Social Login Icons -->
      <div class="socialIconContainer">
        <v-btn small outline fab color="primary">
          <v-icon>fab fa-facebook-f</v-icon>
        </v-btn>
        <v-btn small outline fab color="primary">
          <v-icon>fab fa-twitter</v-icon>
        </v-btn>
        <v-btn small outline fab color="primary">
          <v-icon>fab fa-google-plus-g</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Logout div at bottom -->
    <div class="logoutDiv">
      <v-btn large class="logoutBtn" color="primary">LOG OUT</v-btn>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    visible: false
  }),
  methods: {
    logout() {
      this.$store.dispatch('cognito/signOut')
    }
  }
}
</script>

<style lang="scss">
#menuComponent {
  height: 100vh;
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
  width: 100%;
  background-image: linear-gradient(#ffdf01, #ffb92d);

  .topRightCloseBtn {
    position: absolute;
    top: 5px;
    right: 15px;
    color: white;
    font-size: 20px;
    font-weight: lighter;
  }

  .logoText {
    padding-top: 8vh;
    padding-bottom: 3vh;
    text-align: center;

    font-family: QuatroBold;
    letter-spacing: 3px;
    font-size: 24px;
    color: white;

    .dark-font {
      color: $primary-color;
    }
  }

  .menuItemsContainer {
    // border: 1px solid red;
    height: 70vh;
    text-align: center;
    position: relative;
    background-image: url('~assets/images/white_lamp.png');
    background-size: 90%;
    background-position-x: 50%;

    .menuItems {
      z-index: 10000;
      .menuItem {
        line-height: 12vh;
        a {
          color: white !important;
          text-decoration: none;
        }
      }
    }
    .socialIconContainer {
      margin-top: 3vh;
      button {
        border: 1px solid #ebe7ed;
      }
    }
  }

  .logoutDiv {
    position: absolute;
    bottom: 0px;
    width: 100%;

    .logoIcon {
      height: 26vh !important;
    }

    .logoText {
      width: 200px;
    }

    .logoutBtn {
      width: 100%;
      max-width: none;
      margin: 0px;
      border-radius: 0px;
      margin-top: 10px;
      height: 64px;
      letter-spacing: 2px;
    }
  }
}
</style>
