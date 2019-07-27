<template>
  <div id="signupPage">
    <v-layout class="mainTable" row>
      <!-- Back button -->
      <v-btn class="backBtn" flat icon color="primary" to="/">
        <v-icon>fas fa-arrow-left</v-icon>
      </v-btn>

      <v-flex class="lefgImgContainer" hidden-sm-and-down>
        <img class="imgPersonWithPhone" src="~/assets/images/person_with_phone.png" />
      </v-flex>

      <!-- Register Div -->
      <v-flex class="registerDiv">
        <img class="logoIcon" src="~/assets/images/signup/dark_gray_lamp.png" />
        <br />
        <img class="logoText" src="~/assets/images/logo_text.png" />

        <!-- Register Form -->
        <form>
          <!-- Email Input Box -->
          <v-text-field v-model="name" v-validate="'required|max:100'" :error-messages="errors.collect('name')" data-vv-name="name" class="inputBox name" single-line flat label="Enter name" prepend-inner-icon="fas fa-user"></v-text-field>

          <!-- Email Input Box -->
          <v-text-field v-model="email" v-validate="'required|email'" class="inputBox email" :error-messages="errors.collect('email')" data-vv-name="email" single-line flat label="Enter email" prepend-inner-icon="email"></v-text-field>

          <!-- Continue Button -->
          <v-btn large class="continueBtn" @click="signup">Continue</v-btn>
        </form>

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

        <!-- Login div at bottom -->
        <div class="loginDiv">
          <div class="loginTitle">Alreay have an account?</div>
          <v-btn large class="loginBtn" color="primary" to="/auth/login">LOGIN</v-btn>
        </div>
      </v-flex>

      <v-flex class="rightImgContainer" hidden-sm-and-down>
        <img class="imgLightGrayLamp" src="~/assets/images/signup/light_gray_lamp.png" />
        <img class="imgPersonWithPhone" src="~/assets/images/signup/lady_with_phone.png" />
      </v-flex>
    </v-layout>

    <!-- Fixed Footer -->
    <v-layout hidden-sm-and-down class="fixedFooter" :style="{
        'background-image':
          'url(' + require('~/assets/images/signup/footer_background.png') + ')'
      }"></v-layout>
  </div>
</template>

<script>
import nanoid from 'nanoid'
import { getErrorMessage } from '~/utils'
export default {
  data: () => ({
    email: '',
    name: ''
  }),
  $_veeValidate: {
    validator: 'new'
  },
  mounted() {
    this.$validator.localize('en', this.dictionary)
  },
  methods: {
    async signup() {
      try {
        //Validate input fields
        let result = await this.$validator.validateAll()
        if (!result) {
          return
        }

        await this.$store.dispatch('cognito/registerUser', {
          username: this.email,
          password: nanoid()
        })

        // Redirect to registeration success page
        this.$router.push({
          name: 'auth-signup-success',
          params: { email: this.email }
        })
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
#signupPage {
  // border: 1px solid red;
  height: 100vh;
  overflow: hidden;
  background: white;
  overflow: hidden;

  .mainTable {
    height: 100vh;
    z-index: 100;
    .backBtn {
      color: $primary-color;
      position: absolute;
      padding: 25px;
      z-index: 5000;
      i {
        font-size: 16px;
      }
    }

    .lefgImgContainer {
      position: relative;
      z-index: 10;
      .imgPersonWithPhone {
        height: 70vh;
        position: absolute;
        right: 4%;
        bottom: 3.5vh;
      }
    }

    .rightImgContainer {
      position: relative;
      z-index: 100;

      .imgLightGrayLamp {
        height: 55vh;
        position: absolute;
        left: 10%;
        top: 0;
      }

      .imgPersonWithPhone {
        height: 70vh;
        position: absolute;
        left: 4%;
        bottom: 3.5vh;
      }
    }

    .registerDiv {
      // border: 1px solid red;
      text-align: center;
      padding-top: 7vh;
      z-index: 10;
      height: 100vh;

      @media #{$small-screen} {
        padding-top: 10vh;
      }

      .logoIcon {
        width: 70px;
        @media #{$small-screen} {
          // padding-top: 30vh;
          // background: red !important;
          height: 15vh !important;
          width: auto !important;
        }
      }

      .logoText {
        width: 200px;
        margin-bottom: 7vh !important;
      }

      .inputBox {
        width: 70%;
        margin: auto;
        max-width: 400px;
        margin-top: 0.5vh !important;

        .v-input__prepend-inner {
          padding-right: 15px;
          font-size: 12px;
          i {
            // color: red !important;
            font-size: 18px;
          }
        }

        @media #{$medium-screen} {
          max-width: none;
          width: 80%;
        }
      }

      .continueBtn {
        border-radius: 4px;
        margin-top: 20px;
        background-image: linear-gradient(to left, #ffdf01, #ffb92d);
        color: white;
        width: 70%;

        letter-spacing: 1px;

        @media #{$medium-screen} {
          max-width: none;
          width: 80%;
        }
      }

      .socialIconContainer {
        margin-top: 3vh;
        button {
          border: 1px solid #ebe7ed;
        }
      }

      .loginDiv {
        margin-top: 2vh;
        .loginTitle {
          font-size: 14px;
          font-weight: normal;
          font-style: normal;
          font-stretch: normal;
          line-height: 1.57;
          letter-spacing: normal;
          text-align: center;
          color: #c8c7c7;
        }
        .loginBtn {
          width: 70%;
          max-width: 400px;
          border-radius: 4px;
          letter-spacing: 1px;
        }
      }

      @media #{$small-screen} {
        .loginDiv {
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
