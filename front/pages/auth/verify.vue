<template>
  <div id="verify-container">
    <v-progress-linear
      :value="progressBarValue"
      :indeterminate="progressBarUndetermined"
      :active="progressBarActive"
      :height="2"
      absolute
    ></v-progress-linear>
    <div class="verify-message">
      <div class="verify-message__image-container">
        <div class="verify-message__image-container__image-wrapper inactive">
          <img
            class="verify-message__image-container__image inactive"
            src="~/assets/images/verify/lamp-inactive-large.png"
            alt=""
          />
        </div>
        <div
          class="verify-message__image-container__image-wrapper active"
          style="opacity: 0"
          :style="activeLampStyle"
        >
          <img
            class="verify-message__image-container__image active"
            src="~/assets/images/verify/lamp-active-large.png"
            alt=""
          />
        </div>
      </div>
      <div
        class="verify-message__text"
        :class="{
          'has-error': errorOccurred,
          'has-info': !errorOccurred && !authCompleted,
          'has-success': !errorOccurred && authCompleted
        }"
      >
        <div v-text="message">
          We are currently checking your credentials. You will be forwarded to
          Ideas page shortly...
        </div>
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
    errorOccurred: false,
    progressBarValue: 0,
    progressBarUndetermined: false,
    progressBarActive: true,
    authCompleted: false
  }),
  computed: {
    activeLampStyle() {
      return {
        opacity: this.authCompleted ? 1 : 0
      }
    }
  },
  mounted() {
    this.login()
  },
  methods: {
    async login() {
      try {
        this.progressBarActive = true
        this.progressBarUndetermined = true
        const user = await this.$store.dispatch('cognito/signInUser', {
          username: this.$route.query.email
        })
        await this.$store.dispatch('cognito/answerCustomChallenge', {
          user,
          answer: this.$route.query.code
        })
        await this.$store.commit('userData/setUserIsAuthenticated')
        this.$store.dispatch('userData/fetchUserData', {})
        this.progressBarActive = false
        this.progressBarUndetermined = false
        this.authCompleted = true
        this.message = "Success! We're redirecting to your dashboard."
        this.$router.replace('/ideas/me')
      } catch (e) {
        this.progressBarActive = false
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
  &__image-container {
    position: relative;
    &__image-wrapper {
      position: absolute;
      width: 100%;
      height: 100%;
      transition: opacity 0.3s ease;
    }
    &__image {
      height: 100%;
      width: auto;
      display: block;
      margin: auto;
    }

    /*background-color: #5c6576;*/
    height: 60%;
    /*background-image: url('~assets/images/light_gray_lamp_plain.png');*/
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
  &__text {
    text-align: center;
    padding-top: 50px;
    height: 40%;
    transition: color 0.2s ease;
    color: #c0b7c5;

    font-size: 16px;
    &.has-info {
      color: #c0b7c5;
    }
    &.has-error {
      color: #b71c1c;
    }
    &.has-success {
      color: #c0b7c5;
    }
  }
}
</style>
