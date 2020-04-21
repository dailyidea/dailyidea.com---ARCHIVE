<template>
  <auth-page lamp-on>
    <div class="text-center">
      <h1 class="pt-10 pb-6">Hooray!</h1>
      <p>We've sent a confirmation link to <strong>{{ email }}</strong>.</p>
      <p>Please check your inbox and click on the link in your email to get started!</p>
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
</style>
