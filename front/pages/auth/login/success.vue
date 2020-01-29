<template>
  <auth-layout>
    <!-- Centered Div -->
    <v-flex class="successMessage">
      <!-- Logo Icons -->
      <logo-container></logo-container>

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
    <resend-auth-email-dialog ref="resend-auth-email-dialog">
    </resend-auth-email-dialog>
  </auth-layout>
</template>

<script>
import resendAuthEmailDialog from '@/components/dialogs/resendAuthEmail'
import authLayout from '~/components/auth/authLayout'
import logoContainer from '~/components/auth/logoContainer'
export default {
  components: { resendAuthEmailDialog, authLayout, logoContainer },
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
</style>
