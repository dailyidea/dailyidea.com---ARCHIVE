<template>
  <auth-page lamp-on>
    <div class="text-center">
      <h1 class="pt-10 pb-6">Welcome Back!</h1>
      <p>
        We've sent a login email to you at <strong>{{ email }}</strong
        >.
      </p>
      <p>Please click the button in that email to log in to daily idea.</p>

      <div class="mt-10">
        <p class="muted smaller">
          Didn't get a confirmation email?
          <a @click="showPopup">Request a new link.</a>
        </p>
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
      this.email = this.$route.query.email.toLowerCase()
    }
  },
  methods: {
    showPopup() {
      this.$refs['resend-auth-email-dialog'].open(this.email.toLowerCase())
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';
</style>
