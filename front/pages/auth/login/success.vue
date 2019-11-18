<template>
  <div id="loginSuccessPage">
    <!-- Back button -->
    <v-btn class="backBtn" text icon color="primary" to="/">
      <v-icon>fas fa-arrow-left</v-icon>
    </v-btn>

    <!-- Main Grid -->
    <v-layout row class="gridContainer">
      <!-- Desktop Only - Left Side Image Container -->
      <v-flex class="leftSideImageContainer" hidden-sm-and-down>
        <img class="imgBigTree" src="~/assets/images/bigTree.png" />
        <img
          class="imgPersonWithPhone"
          src="~/assets/images/person_with_phone.png"
        />
      </v-flex>

      <!-- Centered Div -->
      <v-flex class="successMessage">
        <!-- Logo Icons -->
        <div class="logoContainer">
          <img
            class="logoIcon"
            src="~/assets/images/bulb_with_light_holder.png"
          />
          <img class="logoText" src="~/assets/images/logo_text.png" />
        </div>

        <!-- Hero Message -->
        <div class="heroMsg">Welcome Back!</div>

        <!-- Hero Description -->
        <div class="heroDescription">
          We've sent a login email to you at <strong>{{ email }}</strong
          >. Please click the button in that email to log in to daily idea.
        </div>

        <div class="requestLink">
          <a @click="showPopup">Didn't get it? Request a new link</a>
        </div>
      </v-flex>

      <v-flex class="rightImgContainer" hidden-sm-and-down>
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
    <resend-auth-email-dialog ref="resend-auth-email-dialog">
    </resend-auth-email-dialog>
  </div>
</template>

<script>
import resendAuthEmailDialog from '@/components/dialogs/resendAuthEmail'
export default {
  components: { resendAuthEmailDialog },
  data: () => ({
    email: null,
    success: false
  }),
  mounted() {
    if (this.$route.query.email) {
      this.email = this.$route.query.email
    }
  },
  methods: {
    showPopup() {
        this.$refs['resend-auth-email-dialog'].open(this.email)
    }
  }
}
</script>

<style lang="scss">
#loginSuccessPage {
  // border: 1px solid red;
  height: 95vh;
  width: 100%;
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

    .leftSideImageContainer {
      position: relative;
      z-index: 10;

      .imgBigTree {
        height: 75vh;
        position: absolute;
        left: -2%;
        top: 20vh;
      }

      .imgPersonWithPhone {
        height: 70vh;
        position: absolute;
        right: 0;
        left: 52%;
        bottom: 5vh;
      }
    }

    .rightImgContainer {
      position: relative;
      z-index: 10;

      .smallTreeImage {
        height: 85vh;
        position: absolute;
        left: 50%;
        bottom: 10vh;
      }

      .imgPersonWithPhone {
        height: 70vh;
        position: absolute;
        left: 10%;
        bottom: 5vh;
      }
    }

    .successMessage {
      max-width: 600px;
      text-align: center;
      padding-top: 8vh;
      z-index: 10;
      padding-left: 100px;
      padding-right: 100px;
      // border: 1px solid red;

      overflow: hidden;

      @media #{$small-screen} {
        padding-top: 10vh;
        padding-left: 10%;
        padding-right: 10%;
      }

      .logoContainer {
        // width: 100%;
        text-align: center;
        .logoIcon {
          height: 17vh;
          display: block;
          margin: auto;

          @media #{$small-screen} {
            // padding-top: 30vh;
            // background: red !important;
            height: 20vh !important;
            width: auto !important;
          }
        }

        .logoText {
          height: 40px;
          display: block;
          margin: auto;
        }
      }

      .heroMsg {
        margin-top: 10vh;
        font-size: 35px;
        line-height: 1.66;
        color: #18141c;

        @media #{$small-screen} {
          font-size: 35px;
        }
      }

      .heroDescription {
        margin-top: 2vh;
        line-height: 1.59;
        color: #827c85;

        a {
          font-size: 18px;
          color: #7777;
        }

        @media #{$small-screen} {
          margin-top: 30px;
          font-size: 14px;
        }
      }

      .requestLink {
        margin-top: 30px;
        font-size: 15px;
        a {
          color: $accent-color !important;
          text-decoration: underline;
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
