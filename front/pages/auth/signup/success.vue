<template>
  <auth-page lamp-on>
    <div class="text-center">
      <h1 class="pt-10 pb-6">Hooray!</h1>
      <p>
        We've sent a confirmation link to <strong>{{ email }}</strong
        >.
      </p>
      <p>
        Please check your inbox and click on the link in your email to get
        started!
      </p>

      <v-btn
        v-if="isGmail"
        rounded
        href="https://mail.google.com/mail/u/0/#search/in%3Aanywhere+subject%3A%22[Daily+Idea]+Magic+link%22"
        target="_blank"
        >Check your Gmail inbox
      </v-btn>
    </div>
  </auth-page>
</template>

<script>
import AuthPage from '@/components/authPage/AuthPage'

export default {
  name: 'Success',

  components: { AuthPage },

  data: () => ({
    email: null
  }),

  computed: {
    isGmail() {
      return this.email && this.email.match(/gmail.com$/i)
    }
  },

  mounted() {
    if (this.$route.params.email) {
      this.email = this.$route.params.email.toLowerCase()
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';
</style>
