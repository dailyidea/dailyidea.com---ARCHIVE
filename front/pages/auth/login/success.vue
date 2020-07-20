<template>
  <auth-page lamp-on>
    <div class="text-center">
      <h1 class="pt-10 pb-6">Welcome Back!</h1>
      <p>
        We've sent a login email to you at <strong>{{ email }}</strong
        >.
      </p>
      <p>Please click the button in that email to log in to daily idea.</p>

      <v-btn
        v-if="isGmail"
        rounded
        href="https://mail.google.com/mail/u/0/#search/in%3Aanywhere+subject%3A%22[Daily+Idea]+Log+in+link%22"
        target="_blank"
        >Check your Gmail inbox
      </v-btn>

      <div class="mt-10">
        <p class="muted smaller">
          Didn't get a confirmation email?
          <a @click="showPopup">Request a new link.</a>
        </p>
      </div>
    </div>

    <resend-auth-email-dialog v-model="showResendEmail" :email="email" />
  </auth-page>
</template>

<script>
import AuthPage from '@/components/authPage/AuthPage'
import ResendAuthEmailDialog from '@/components/dialogs/ResendAuthEmail'

export default {
  name: 'Success',

  components: { AuthPage, ResendAuthEmailDialog },

  data: () => ({
    email: null,
    showResendEmail: false
  }),

  computed: {
    isGmail() {
      return this.email && this.email.match(/gmail.com$/i)
    }
  },

  mounted() {
    if (this.$route.query.email) {
      this.email = this.$route.query.email.toLowerCase()
    }
  },

  methods: {
    showPopup() {
      this.showResendEmail = true
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';
</style>
