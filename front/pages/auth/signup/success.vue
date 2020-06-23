<template>
  <auth-page lamp-on>
    <div class="successMessage">
      <div class="heroMsg">Hooray!</div>
      <!-- Hero Description -->
      <div class="heroDescription">
        We've sent an email to <strong>{{ email }}</strong
        >, containing instructions to create the account and start sharing ideas.
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
      this.email = this.$route.params.email.toLowerCase()
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';

@include authLoginSuccessStyle;
</style>
