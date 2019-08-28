<template>
  <div id="loginPage">
    <!-- Back button -->
    <v-btn class="backBtn" text icon color="primary" to="/">
      <v-icon>fas fa-arrow-left</v-icon>
    </v-btn>

    <v-layout class="mainTable" row>
      <v-flex class="lefgImgContainer" hidden-sm-and-down>
        <img class="imgLightGrayLamp" src="~/assets/images/signup/light_gray_lamp.png" />
        <img class="imgPersonWithPhone" src="~/assets/images/person_with_phone.png" />
      </v-flex>

      <!-- login Div -->
      <v-flex class="loginDiv">
        <img class="logoIcon" src="~/assets/images/bulb_with_light_holder.png" />
        <br />
        <img class="logoText" src="~/assets/images/logo_text.png" />

        <!-- Login Form -->
        <v-form>
          <!-- Email Input Box -->
          <validate-text-field :value.sync="email" single-line flat class="emailInput" name="email" autocomplete="email" type="email" prepend-inner-icon="email" placeholder="Enter Email" validate="required|email" />

          <!-- Continue Button -->
          <v-btn large class="continueBtn" @click="login">OK</v-btn>
        </v-form>

        <!-- Social Login Icons -->
        <div class="socialIconContainer">
          <v-btn outlined fab color="primary">
            <v-icon>fab fa-facebook-f</v-icon>
          </v-btn>
          &nbsp;&nbsp;&nbsp;
          <v-btn outlined fab color="primary">
            <v-icon>fab fa-twitter</v-icon>
          </v-btn>
          &nbsp;&nbsp;&nbsp;
          <v-btn outlined fab color="primary">
            <v-icon>fab fa-google-plus-g</v-icon>
          </v-btn>
        </div>
      </v-flex>

      <v-flex class="rightImgContainer" hidden-sm-and-down>
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
import ValidateTextField from '../../../components/ValidateTextField'
import ActionValidate from '~/mixins/validatable'
import { getErrorMessage } from '~/utils'

export default {
  components: { ValidateTextField },
  $_veeValidate: { validator: 'new' },
  mixins: [ActionValidate],
  data: () => ({
    email: ''
  }),
  methods: {
    async login() {
      try {
        //Validate input fields
        let result = await this.$validator.validateAll()
        if (!result) {
          return
        }

        await this.$amplifyApi.post('RequestLogin', '', {
          body: { email: this.email }
        })

        // Redirect to login success page
        this.$router.push({
          name: 'auth-login-success',
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

<style lang="scss" scoped>
#loginPage {
  height: 100vh;
  overflow: hidden;
  background: white;
  // border: 1px solid red;
  z-index: 1000;

  .backBtn {
    color: $primary-color;
    position: fixed;
    top: 0;
    left: 0;
    margin: 5px 3px;
    z-index: 100;

    i {
      font-size: 16px;
    }
  }

  .mainTable {
    margin: 0px;
    height: 100vh;

    .lefgImgContainer {
      position: relative;
      z-index: 10;

      .imgLightGrayLamp {
        height: 55vh;
        position: absolute;
        left: 10%;
        top: 7vh;
      }

      .imgPersonWithPhone {
        height: 75vh;
        position: absolute;
        right: 0;
        bottom: 3vh;
      }
    }

    .rightImgContainer {
      position: relative;
      z-index: 10;

      .imgPersonWithPhone {
        height: 65vh;
        position: absolute;
        left: 6%;
        bottom: 3vh;
      }
    }

    .loginDiv {
      // border: 1px solid red;
      text-align: center;
      padding-top: 7vh;
      z-index: 10;
      height: 85vh;
      overflow: hidden;

      @media #{$small-screen} {
        padding-top: 10vh;
      }

      .logoIcon {
        width: 20vh;

        @media #{$small-screen} {
          // padding-top: 30vh;
          // background: red !important;
          height: 15vh !important;
          width: auto !important;
        }
      }

      .logoText {
        width: 200px;
      }

      .emailInput {
        margin-top: 7vh !important;
        margin-bottom: 20px;

        .v-input__prepend-inner {
          padding-right: 15px;
        }
      }

      .emailInput {
        width: 70%;
        margin: auto;
        max-width: 400px;

        @media #{$medium-screen} {
          max-width: none;
          width: 80%;
        }
      }

      .continueBtn {
        margin-top: 7vh;
        border-radius: 4px;
        background-image: linear-gradient(to left, #ffdf01, #ffb92d);
        color: white;
        width: 40%;

        letter-spacing: 1px;

        @media #{$medium-screen} {
          max-width: none;
          width: 80%;
        }
      }

      .socialIconContainer {
        margin-top: 5vh;
        margin-bottom: 4vh;

        button {
          border: 1px solid #ebe7ed;
          .v-icon {
            font-size: 17px;
          }

          i {
            font-size: 20px;
          }
        }
      }

      // .loginDiv {
      //   margin-top: 5vh;
      //   .loginTitle {
      //     font-size: 14px;
      //     font-weight: normal;
      //     font-style: normal;
      //     font-stretch: normal;
      //     line-height: 1.57;
      //     letter-spacing: normal;
      //     text-align: center;
      //     color: #c8c7c7;
      //   }
      //   .loginBtn {
      //     width: 70%;
      //     max-width: 400px;
      //     border-radius: 4px;
      //     letter-spacing: 1px;
      //   }
      // }

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
    background-position-y: 30px;
  }
}
</style>
