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

      <gmail-search-btn
        v-if="$vuetify.breakpoint.mdAndUp"
        :email="email"
        search="[Daily+Idea]+Magic+link"
      ></gmail-search-btn>
    </div>
  </auth-page>
</template>

<script>
import AuthPage from '@/components/authPage/AuthPage'
import GmailSearchBtn from '@/components/shared/GmailSearchBtn'

export default {
  name: 'Success',

  components: { GmailSearchBtn, AuthPage },

  data: () => ({
    email: null
  }),

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
