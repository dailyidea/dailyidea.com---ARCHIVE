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

      <!-- Centered Register Div -->
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
          We've sent you a login link. Click that in your inbox to log in to the
          site.
        </div>

        <div class="requestLink">
          <a>Didn't get it? Request a new link</a>
        </div>

        <!-- Social Login Icons -->
        <div class="socialIconContainer">
          <v-btn outlined fab color="primary">
            <v-icon>fab fa-facebook-f</v-icon>
          </v-btn>
          <v-btn outlined fab color="primary">
            <v-icon>fab fa-twitter</v-icon>
          </v-btn>
          <v-btn outlined fab color="primary">
            <v-icon>fab fa-google-plus-g</v-icon>
          </v-btn>
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
  </div>
</template>

<script>
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
  methods: {}
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
      padding-left: 10%;
      padding-right: 10%;
      // border: 1px solid red;

      overflow: hidden;

      @media #{$small-screen} {
        padding-top: 10vh;
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
          color: #777;
          text-decoration: underline;
        }
      }

      // .actionBtn {
      // 	.okBtn {
      // 		border-radius: 4px;
      // 		background-image: linear-gradient(to left, #ffdf01, #ffb92d);
      // 		color: white;
      // 		width: 246px;
      // 		margin-top: 4vh;

      // 		letter-spacing: 1px;

      // 		@media #{$medium-screen} {
      // 			width: 10%;
      // 		}
      // 	}
      // }

      .browsePublicIdeaBtn {
        border-radius: 4px;

        width: 246px;
        margin-top: 2vh;

        letter-spacing: 1px;

        @media #{$medium-screen} {
          width: 130px;
        }
      }

      .socialIconContainer {
        margin-top: 7vh;

        button {
          border: 1px solid #ebe7ed;
          margin-left: 10px;
          margin-right: 10px;
          .v-icon {
            font-size: 17px;
          }

          i {
            font-size: 20px;
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
