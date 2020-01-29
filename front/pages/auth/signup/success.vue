<template>
  <auth-layout>
    <!-- Centered  Div -->
    <v-flex class="successMessage">
      <!-- Logo Icons -->
      <logo-container></logo-container>
      <!-- Hero Message -->
      <div class="heroMsg">Hooray!</div>

      <!-- Hero Description -->
      <div class="heroDescription">
        We've sent a sign in link to <strong>{{ email }}</strong
        >. Please check your inbox and click on the email confirmation
        link in the email to get started!
      </div>
    </v-flex>
  </auth-layout>
</template>

<script>
import authLayout  from '~/components/auth/authLayout'
import logoContainer from '~/components/auth/logoContainer'
export default {
  components: { authLayout, logoContainer },
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
.successMessage {
  max-width: 600px;
  text-align: center;
  padding-top: 16vh;
  z-index: 10;
  padding-left: 100px;
  padding-right: 100px;
  // border: 1px solid red;

  overflow: hidden;

  @media #{$small-screen} {
    padding-top: 15vh;
    padding-left: 10%;
    padding-right: 10%;
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

  .requestLink {
    margin-top: 30px;
    font-size: 15px;
    a {
      color: #777;
      text-decoration: underline;
    }
  }
}
</style>
