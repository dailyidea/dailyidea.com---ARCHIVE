<template>
  <div id="menuComponent">
    <!-- Right side close button -->
    <div class="topRightCloseBtn">
      <i class="fa fa-times"></i>
    </div>

    <!-- Logo -->
    <div class="logoText">
      <span class="dark-font">DAILY</span><span class="light-font">IDEA</span>
    </div>

    <!-- Menu Items -->
    <div class="menuItemsContainer">
      <img class="imgBackgroundLamp" src="~/assets/images/white_lamp.png" />
      <div class="menuItems">
        <div class="menuItem">My Ideas</div>
        <div class="menuItem">Saved Ideas</div>
        <div class="menuItem">Settings</div>
        <div class="menuItem">My Profile</div>
        <div class="menuItem">My Groups</div>
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
      <v-btn large class="loginBtn" color="primary">LOG OUT</v-btn>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({}),
  methods: {}
}
</script>

<style lang="scss">
@import './assets/style/variables.scss';
// Remove top header manually
#app {
  .toolBar {
    display: none;
  }
  .nuxtContainer {
    padding-top: 0px !important;
  }
}

#menuComponent {
  height: 100vh;
  overflow: hidden;
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
    .imgBackgroundLamp {
      position: absolute;
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
      width: 95%;
      opacity: 0.7;
      z-index: 0;
    }
    .menuItems {
      z-index: 1;
      color: white;
      .menuItem {
        line-height: 12vh;
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
    position: fixed;
    bottom: 0px;
    width: 100%;

    .logoIcon {
      height: 26vh !important;
    }

    .logoText {
      width: 200px;
    }

    .loginBtn {
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
