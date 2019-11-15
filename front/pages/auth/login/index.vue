<template>
  <div id="loginPage">
    <!-- Back button -->
    <v-btn class="backBtn" text icon color="primary" to="/">
      <v-icon>fas fa-arrow-left</v-icon>
    </v-btn>

    <v-layout class="mainGrid" row>
      <!-- Left Side Image -->
      <v-flex class="lefgImgContainer" hidden-sm-and-down>
        <img class="bigTreeImage" src="~/assets/images/bigTree.png" />
        <img
          class="imgPersonWithPhone"
          src="~/assets/images/person_with_phone.png"
        />
      </v-flex>

      <!-- login Div -->
      <v-flex class="loginDiv">
        <img
          class="logoIcon"
          src="~/assets/images/bulb_with_light_holder.png"
        />
        <br />
        <img class="logoText" src="~/assets/images/logo_text.png" />

        <!-- Login Form -->
        <v-form @submit.prevent="login">
          <!-- Email Input Box -->
          <validate-text-field
            :value.sync="email"
            single-line
            flat
            class="emailInput"
            name="email"
            autocomplete="email"
            type="email"
            prepend-inner-icon="email"
            placeholder="What is your email address?"
            validate="required|email"
          />

          <!-- Email Not Found Message -->
          <div v-if="emailNotFoundMsg != ''" class="emailNotFoundMsg">
            {{ emailNotFoundMsg }}
            <div>
              <v-btn to="/auth/signup" text small color="#827C85"
                >Create an account?</v-btn
              >
            </div>
          </div>

          <!-- Login Button -->
          <v-btn
            type="submit"
            large
            class="loginBtn"
            :loading="logingUser"
            @click="login"
            >Log In</v-btn
          >
        </v-form>

        <!-- Create account div at bottom -->
        <div class="createAccountDiv">
          <div class="existsTitle">
            Don't have an account yet?
            <nuxt-link class="signupBtn" text to="/auth/signup"
              >Create Account</nuxt-link
            >
          </div>
        </div>
      </v-flex>

      <!-- Right side desktop only image -->
      <v-flex class="rightImgContainer" hidden-sm-and-down>
        <img class="smallTreeImage" src="~/assets/images/smallTree.png" />
        <img
          class="imgPersonWithPhone"
          src="~/assets/images/signup/lady_with_phone.png"
        />
      </v-flex>
    </v-layout>

    <!-- Fixed Footer - desktop only -->
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
import ValidateTextField from '../../../components/ValidateTextField'
import ActionValidate from '~/mixins/validatable'
import { getErrorMessage } from '~/utils'

export default {
  components: { ValidateTextField },
  $_veeValidate: { validator: 'new' },
  mixins: [ActionValidate],
  data: () => ({
    email: '',
    logingUser: false,
    emailNotFoundMsg: ''
  }),
  methods: {
    async login() {
      try {
        this.logingUser = true
        this.emailNotFoundMsg = ''

        // Validate input fields
        const result = await this.$validator.validateAll()
        if (!result) {
          this.logingUser = false
          return
        }

        await this.$amplifyApi.post('RequestLogin', '', {
          body: { email: this.email }
        })

        this.logingUser = false

        // Redirect to login success page
        this.$router.push({
          name: 'auth-login-success',
          params: { email: this.email }
        })
        this.logingUser = false
      } catch (e) {
        this.logingUser = false

        // Handle email not found
        if (e.response && e.response.data.message === 'Email not found') {
          this.emailNotFoundMsg =
            "Sorry, we can't find an account with this email address. Do you want to"
          return
        }

        this.$snotify.error(getErrorMessage(e), 'Error', {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        })
        this.logingUser = false
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

  .mainGrid {
    margin: 0px;
    height: 100vh;

    .lefgImgContainer {
      position: relative;
      z-index: 10;

      .bigTreeImage {
        height: 75vh;
        position: absolute;
        left: -3%;
        top: 20vh;
      }

      .imgPersonWithPhone {
        height: 75vh;
        position: absolute;
        right: 10%;
        bottom: 3vh;
      }
    }

    .rightImgContainer {
      position: relative;
      z-index: 10;

      .smallTreeImage {
        height: 90vh;
        position: absolute;
        left: 58%;
        bottom: 6vh;
      }

      .imgPersonWithPhone {
        height: 72vh;
        position: absolute;
        left: 20%;
        bottom: 3vh;
      }
    }

    .loginDiv {
      // border: 1px solid red;
      text-align: center;
      padding-top: 15vh;
      z-index: 10;
      height: 100vh;
      overflow: hidden;

      @media #{$small-screen} {
        padding-top: 10vh;
      }

      .logoIcon {
        height: 20vh;

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
        margin-top: 10vh !important;
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

      .emailNotFoundMsg {
        width: 70%;
        margin: auto;
        max-width: 420px;
        color: #c8c7c7;
      }

      .loginBtn {
        margin-top: 7vh;
        border-radius: 4px;
        width: 40%;

        letter-spacing: 1px;

        @media #{$medium-screen} {
          max-width: none;
          width: 80%;
        }
      }

      .createAccountDiv {
        margin-top: 6vh;

        .existsTitle {
          font-size: 14px;
          line-height: 1.57;
          color: #c8c7c7;
          // margin-bottom: 5px;

          .signupBtn {
            text-decoration: none;
          }
        }
      }

      @media #{$small-screen} {
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
          width: 70%;
          margin-top: 10px;
        }

        .createAccountDiv {
          position: fixed;
          bottom: 0;
          width: 100%;

          .signupBtn {
            display: block;
            width: 100%;
            border-radius: 0px;
            padding: 20px !important;
            background-color: $primary-color !important;
            color: white !important;
            margin-top: 3px;
            text-transform: uppercase !important;
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
