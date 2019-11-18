<template>
  <div id="verify-container">
    <div class="verify-message">
      <div class="verify-message__image"></div>
      <div class="verify-message__text" :class="{'has-error':errorOccurred,'has-info':!errorOccurred}">
        <div v-bind="message">We are currently checking your credentials. You will be forwarded to Ideas page shortly...</div>
        <div v-if="errorOccurred" class="">
          <a href="/auth/login" @click.stop.prevent="goToLogin"
            >Back to Log In Page</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    message:
      'We are currently checking your credentials. You will be forwarded to Ideas page shortly...',
    errorOccurred: false
  }),
  mounted() {
    this.login()
  },
  methods: {
    async login() {
      try {
        const user = await this.$store.dispatch('cognito/signInUser', {
          username: this.$route.query.email
        })
        await this.$store.dispatch('cognito/answerCustomChallenge', {
          user,
          answer: this.$route.query.code
        })
        this.$router.replace('/ideas/me')
      } catch (e) {
        this.message = e.message + ' Try again Please.'
        this.errorOccurred = true
      }
    },
    goToLogin() {
      this.$router.replace('/auth/login')
    }
  }
}
</script>
<style lang="scss" scoped>
#verify-container {
  width: 100%;
  height: 100%;
  /*background-color: #0c5404;*/
  overflow: hidden;
}
.verify-message {
  background-color: white;
  width: 300px;
  height: 400px;
  position: relative;
  top: calc(50% - 200px);
  left: calc(50% - 150px);
  &__image {
    /*background-color: #5c6576;*/
    height: 60%;
    background-image: url('~assets/images/light_gray_lamp_plain.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
  &__text {
    text-align: center;
    padding-top: 50px;
    height: 40%;

    font-size: 16px;
    &.has-info {
      color: #7777;
    }
    &.has-error {
      color: #b71c1c;
    }
  }
}
</style>
