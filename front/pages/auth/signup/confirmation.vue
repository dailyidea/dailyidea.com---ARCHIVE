<template>
  <auth-layout>
    <!-- Centered  Div -->
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
      <div class="heroMsg">Welcome!</div>

      <!-- Hero Description -->
      <div class="heroDescription">
        Daily Idea lets you browse other people's ideas but also save your
        own. What would you like to do?
      </div>

      <!-- Action Buttons -->
      <div class="actionButtonContainer">
        <v-btn large class="actionBtn" to="/ideas/create"
          >Save a new idea</v-btn
        >
        <v-btn large dark class="actionBtn" to="/ideas/all"
          >browse public ideas</v-btn
        >
      </div>
    </v-flex>
  </auth-layout>
</template>

<script>
import authLayout  from '~/components/auth/authLayout'

export default {
  components: { authLayout },
  data: () => ({}),
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
.successMessage {
  max-width: 700px;
  text-align: center;
  padding-top: 14vh;
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

  .actionButtonContainer {
    margin-top: 6vh;

    .actionBtn {
      border-radius: 4px;
      background-image: linear-gradient(to left, #ffdf01, #ffb92d);
      color: white;
      width: 246px;
      margin-bottom: 3vh;
      letter-spacing: 1px;

      @media #{$medium-screen} {
        width: 130px;
      }
    }
  }

  .browsePublicIdeaBtn {
    border-radius: 4px;

    width: 246px;
    margin-top: 2vh;

    letter-spacing: 1px;

    @media #{$medium-screen} {
      width: 130px;
    }
  }
}
</style>
