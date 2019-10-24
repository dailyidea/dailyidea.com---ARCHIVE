<template>
  <div id="signupPage">
    <!-- Back button -->
    <v-btn class="backBtn" text icon color="primary" to="/">
      <v-icon>fas fa-arrow-left</v-icon>
    </v-btn>

    <!-- Grid -->
    <v-layout class="mainTable" row>
      <!-- Desktop Only - Left Side Image Container -->
      <v-flex class="leftSideImageContainer" hidden-sm-and-down>
        <img class="bigTreeImage" src="~/assets/images/bigTree.png" />
        <img
          class="imgPersonWithPhone"
          src="~/assets/images/person_with_phone.png"
        />
      </v-flex>

      <!-- Register Div -->
      <v-flex class="registerDiv">
        <img class="logoIcon" src="~/assets/images/signup/dark_gray_lamp.png" />
        <br />
        <img class="logoText" src="~/assets/images/logo_text.png" />

        <!-- Register Form -->
        <form>
          <!-- Email Input Box -->
          <v-text-field
            v-model="name"
            v-validate="'required|max:100'"
            :error-messages="errors.collect('name')"
            data-vv-name="name"
            class="inputBox name"
            single-line
            flat
            label="Enter name"
            prepend-inner-icon="fas fa-user"
          ></v-text-field>

          <!-- Email Input Box -->
          <v-text-field
            v-model="email"
            v-validate="'required|email'"
            class="inputBox email"
            :error-messages="errors.collect('email')"
            data-vv-name="email"
            single-line
            flat
            label="Enter email"
            prepend-inner-icon="email"
          ></v-text-field>

          <!-- Email Already Exists Message -->
          <div v-if="emailExistsMsg != ''" class="emailExistsMsg">
            {{ emailExistsMsg }}
            <div>
              <v-btn to="/auth/login" text small color="#827C85"
                >Login instead?</v-btn
              >
            </div>
          </div>

          <!-- Continue Button -->
          <v-btn large class="continueBtn" @click="signup">Continue</v-btn>
        </form>

        <!-- Social Icons -->
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

        <!-- Login div at bottom -->
        <div class="accountExists">
          <div class="existsTitle">Alreay have an account?</div>
          <v-btn large dark class="loginBtn" to="/auth/login">LOGIN</v-btn>
        </div>
      </v-flex>

      <!-- Desktop Only - Right Side Image Container -->
      <v-flex class="rightSideImageContainer" hidden-sm-and-down>
        <img class="smallTreeImage" src="~/assets/images/smallTree.png" />
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
    email: '',
    name: '',
    emailExistsMsg: ''
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
        this.emailExistsMsg = ''

        //Validate input fields
        let result = await this.$validator.validateAll()
        if (!result) {
          return
        }

        await this.$store.dispatch('cognito/registerUser', {
          username: this.email,
          password: nanoid(),
          attributes: {
            name: this.name
          }
        })

        // Redirect to registeration success page
        this.$router.push({
          name: 'auth-signup-success',
          params: { email: this.email }
        })
      } catch (e) {
        // Handle email already registered
        if (e.code && e.code == 'UsernameExistsException') {
          this.emailExistsMsg = 'Sorry, email mentioned already exist.'
          return
        }

        console.log('error', e)
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

  .backBtn {
    color: $primary-color;
    position: fixed;
    top: 0;
    left: 0;
    margin: 5px 3px;
    z-index: 5000;

    i {
      font-size: 16px;
    }
  }

  .mainTable {
    margin: 0px;
    height: 100vh;
    z-index: 100;

    .leftSideImageContainer {
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

    .rightSideImageContainer {
      position: relative;
      z-index: 100;

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

    .registerDiv {
      // border: 1px solid red;
      text-align: center;
      padding-top: 7vh;
      z-index: 10;
      height: 100vh;
      overflow-x: auto;

      @media #{$small-screen} {
        padding-top: 10vh;
      }

      .logoIcon {
        width: 70px;
      }

      .logoText {
        width: 200px;
        margin-bottom: 7vh !important;
      }

      .inputBox {
        width: 70%;
        margin: auto;
        max-width: 420px;
        margin-top: 0.5vh !important;

        .v-input__prepend-inner {
          padding-right: 15px;
          font-size: 12px;

          i {
            font-size: 18px;
          }
        }
      }

      .emailExistsMsg {
        width: 70%;
        margin: auto;
        max-width: 420px;
        color: #c8c7c7;
      }

      .continueBtn {
        border-radius: 4px;
        margin-top: 20px;
        width: 70%;
        max-width: 420px;

        letter-spacing: 1px;
      }

      .socialIconContainer {
        margin-top: 5vh;
        margin-bottom: 4vh;

        button {
          border: 1px solid #ebe7ed;

          i {
            font-size: 16px;
          }
        }
      }

      .accountExists {
        margin-top: 2vh;

        .existsTitle {
          font-size: 14px;
          line-height: 1.57;
          color: #c8c7c7;
          margin-bottom: 5px;
        }

        .loginBtn {
          width: 70%;
          max-width: 420px;
          border-radius: 4px;
          letter-spacing: 1px;
        }
      }

      @media #{$small-screen} {
        position: fixed;
        bottom: 0px;
        width: 100%;

        .logoIcon {
          height: 20vh !important;
          width: auto;
        }

        .logoText {
          width: 200px;
        }

        .inputBox,
        .continueBtn {
          width: 80%;
          max-width: none;
        }

        .accountExists {
          position: fixed;
          bottom: 0;
          width: 100%;

          .loginBtn {
            width: 100%;
            border-radius: 0px;
            padding: 30px;
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
