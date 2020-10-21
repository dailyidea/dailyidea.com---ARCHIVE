<template>
  <v-app>
    <v-progress-linear
      :value="progressBarValue"
      :indeterminate="progressBarUndetermined"
      :active="progressBarActive"
      :height="2"
      absolute
    ></v-progress-linear>

    <link-expired
      v-if="expired"
      :email="$route.query.email"
      :next="$route.query.next"
    />

    <v-container v-else class="fill-height">
      <v-row align="center" justify="center" class="text-center">
        <v-col cols="12" sm="8" md="4">
          <section id="lightBulb" class="mb-6">
            <img
              v-if="authCompleted"
              class="active"
              src="~/assets/images/verify/lamp-active-large.png"
            />
            <img
              v-else
              class="inactive"
              src="~/assets/images/verify/lamp-inactive-large.png"
            />
          </section>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import LinkExpired from '@/components/authPage/LinkExpired'

export default {
  components: { LinkExpired },

  data: () => ({
    message:
      'Hang on tight! Just checking to make sure you are who you say you are...',
    progressBarValue: 0,
    progressBarUndetermined: false,
    progressBarActive: true,
    authCompleted: false,
    expired: false
  }),

  mounted() {
    this.login()
  },

  methods: {
    async login() {
      try {
        this.progressBarActive = true
        this.progressBarUndetermined = true
        if (this.$store.getters['cognito/isLoggedIn']) {
          await this.$store.dispatch('cognito/signOut')
        }
        const user = await this.$store.dispatch('cognito/signInUser', {
          username: this.$route.query.email.toLowerCase()
        })
        await this.$store.dispatch('cognito/answerCustomChallenge', {
          user,
          answer: this.$route.query.code
        })
        await this.$store.commit('userData/setUserIsAuthenticated')
        const userData = await this.$store.dispatch(
          'userData/fetchUserData',
          {}
        )
        const next = this.$route.query.next
          ? decodeURIComponent(this.$route.query.next)
          : undefined
        const fromComment = !!this.$route.query.fc
        const fromIdeaStory = !!this.$route.query.fss
        const redirectToIdeaPage = fromComment || fromIdeaStory
        this.progressBarActive = false
        this.progressBarUndetermined = false
        this.authCompleted = true
        if (!userData.wasWelcomed) {
          this.message = redirectToIdeaPage
            ? "Hooray! You're officially signed up! Now we'll give you a quick tour..."
            : "Hooray! You're officially signed up!"
        } else {
          this.message = redirectToIdeaPage
            ? "Hooray! We'll direct you to your home page next..."
            : "Hooray! We'll direct you to your dashboard next..."
        }

        this.$router.replace(next || '/ideas/all')
      } catch (e) {
        this.progressBarActive = false
        this.expired = true
      }
    },

    goToLogin() {
      this.$router.replace('/auth/login')
    }
  }
}
</script>
<style lang="scss" scoped>
img.active {
  width: 150px;
}
img.inactive {
  width: 147px;
}
</style>
