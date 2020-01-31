<template>
  <auth-page lamp-on>
    <div class="successMessage">
      <div class="heroMsg">Hooray!</div>
      <!-- Hero Description -->
      <div class="heroDescription">
        We've sent a magic link to <strong>{{ email }}</strong
        >. Please check your inbox and click on the email confirmation link in
        the email to get started!
      </div>
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
  mounted() {
    if (this.$route.params.email) {
      this.email = this.$route.params.email
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';

@include authLoginSuccessStyle;
</style>
