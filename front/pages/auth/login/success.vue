<template>
  <auth-page lamp-on>
    <div class="successMessage">
      <div class="heroMsg">Welcome Back!</div>
      <!-- Hero Description -->
      <div class="heroDescription">
        We've sent a login email to you at <strong>{{ email }}</strong
        >. Please click the button in that email to log in to daily idea.
      </div>

      <div class="requestLink">
        <a @click="showPopup">Didn't get it? Request a new link</a>
      </div>
    </div>
    <resend-auth-email-dialog ref="resend-auth-email-dialog">
    </resend-auth-email-dialog>
  </auth-page>
</template>

<script>
import AuthPage from '@/components/authPage/AuthPage'
import resendAuthEmailDialog from '@/components/dialogs/resendAuthEmail'

export default {
  name: 'Success',
  components: { AuthPage, resendAuthEmailDialog },
  data: () => ({
    email: null
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

<style scoped lang="scss">
@import '~assets/style/common';

@include authLoginSuccessStyle;
.requestLink {
  margin-top: 30px;
  font-size: 15px;

  a {
    color: $accent-color !important;
    text-decoration: underline;
  }
}
</style>
