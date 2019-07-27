<template>
  <div id="loginSuccessPage">
    <!-- Back button -->
    <v-btn class="backBtn" flat icon color="primary" to="/">
      <v-icon>fas fa-arrow-left</v-icon>
    </v-btn>

    <v-layout row class="gridContainer">
      <v-flex class="lefgImgContainer" hidden-sm-and-down>
        <img
          class="imgPersonWithPhone"
          src="~/assets/images/person_with_phone.png"
        />
      </v-flex>

      <!-- Register Div -->
      <v-flex class="successMessage">
        <!-- Header Images -->
        <img
          class="logoIcon"
          src="~/assets/images/bulb_with_light_holder.png"
        />
        <br />
        <img class="logoText" src="~/assets/images/logo_text.png" />

        <!-- Hero Message -->
        <div class="heroMsg">Hooray!</div>

        <!-- Hero Description -->
        <div class="heroDescription">
          We've sent you an email confirmation
          <span v-if="email">link at {{ email }}.</span>
          <span v-else>link.</span>
          Click the link to get started!
        </div>

        <!-- Continue Button -->
        <v-btn large class="okBtn">OK</v-btn>

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
      </v-flex>

      <v-flex class="rightImgContainer" hidden-sm-and-down>
        <img
          class="imgLightGrayLamp"
          src="~/assets/images/signup/light_gray_lamp.png"
        />
        <img
          class="imgPersonWithPhone"
          src="~/assets/images/signup/lady_with_phone.png"
        />
      </v-flex>
    </v-layout>

    <!-- Fixed Footer -->
    <v-layout
      hidden-sm-and-down
      class="fixedFooter"
      :style="{
        'background-image':
          'url(' + require('~/assets/images/signup/footer_background.png') + ')'
      }"
    ></v-layout>
  </div>
</template>

<script>
import nanoid from 'nanoid'
import { getErrorMessage } from '~/utils'
export default {
  data: () => ({
    email: null,
    success: false
  }),
  mounted() {
    if (this.$route.params.email) {
      this.email = this.$route.params.email
    }
  },
  methods: {
    async signup() {
      try {
        await this.$store.dispatch('cognito/registerUser', {
          username: this.email,
          password: nanoid()
        })
        this.success = true
      } catch (e) {
        this.$snotify.error(getErrorMessage(e), 'Error', {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        })
      }
    }
  }
}
</script>

<style lang="scss">
#loginSuccessPage {
  // border: 1px solid red;
  height: 100vh;
  overflow: hidden;
  background: white;
  overflow: hidden;

  .backBtn {
    z-index: 100;
    color: $primary-color;
    position: absolute;
    padding: 25px;
    i {
      font-size: 16px;
    }
  }

  .gridContainer {
    height: 100vh;
    .lefgImgContainer {
      position: relative;
      z-index: 10;
      .imgPersonWithPhone {
        height: 70vh;
        position: absolute;
        right: 0;
        bottom: 5vh;
      }
    }

    .rightImgContainer {
      position: relative;
      z-index: 10;

      .imgLightGrayLamp {
        height: 50vh;
        position: absolute;
        left: 10%;
        top: 0;
      }

      .imgPersonWithPhone {
        height: 70vh;
        position: absolute;
        left: 0;
        bottom: 5vh;
      }
    }

    .successMessage {
      // border: 1px solid red;
      text-align: center;
      padding-top: 10vh;
      z-index: 10;

      overflow: hidden;

      @media #{$small-screen} {
        padding-top: 10vh;
      }

      .logoIcon {
        height: 17vh;
        @media #{$small-screen} {
          // padding-top: 30vh;
          // background: red !important;
          height: 15vh !important;
          width: auto !important;
        }
      }

      .logoText {
        height: 40px;
      }

      .heroMsg {
        margin-top: 5vh;
        font-size: 40px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.66;
        letter-spacing: normal;
        text-align: center;
        color: #18141c;
        @media #{$small-screen} {
          font-size: 44px;
        }
      }

      .heroDescription {
        max-width: 400px;
        margin: auto;
        margin-top: 2vh;
        font-size: 18px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.59;
        letter-spacing: normal;
        text-align: center;
        color: #827c85;

        @media #{$small-screen} {
          font-size: 14px;
        }
      }

      .okBtn {
        border-radius: 4px;
        background-image: linear-gradient(to left, #ffdf01, #ffb92d);
        color: white;
        width: 246px;
        margin-top: 4vh;

        letter-spacing: 1px;

        @media #{$medium-screen} {
          width: 130px;
        }
      }

      .socialIconContainer {
        margin-top: 4vh;
        button {
          border: 1px solid #ebe7ed;
        }
      }
    }
  }

  .fixedFooter {
    height: 30vh;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 0;
    // border: 1px solid red;

    background-size: cover;
    // background-position-y: 30px;
  }
}
</style>
