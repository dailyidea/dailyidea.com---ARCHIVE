<template>
  <v-app>
    <link-expired
      v-if="expired"
      :email="$route.query.email"
      :next="$route.query.next"
    />

    <v-container v-else class="fill-height">
      <v-row align="center" justify="center" class="text-center">
        <v-col cols="12" sm="8" md="4">
          <section class="mb-6">
            <img
              v-if="loadingAuth && !authCompleted"
              class="loading-img"
              src="~assets/images/general/loading.gif"
            />
            <img
              v-else
              class="loading-img"
              src="~assets/images/verify/success.svg"
            />
            <img
              v-if="expired"
              class="loading-img"
              src="~assets/images/verify/error.svg"
            />
            <div class="loading-message">
              {{ loadingMessage || 'loading...' }}
            </div>
          </section>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { parse } from 'querystring'
import { mapMutations } from 'vuex'
import LinkExpired from '@/components/authPage/LinkExpired'

export default {
  components: { LinkExpired },

  data: () => ({
    loadingMessage: '',
    loadingAuth: true,
    authCompleted: false,
    expired: false
  }),

  mounted() {
    this.login()
  },

  methods: {
    ...mapMutations({
      setLoadingMessage: 'SET_LOADING_MESSAGE'
    }),

    async login() {
      try {
        this.loadingAuth = true
        const next = this.$route.query.next
          ? decodeURIComponent(this.$route.query.next)
          : undefined
        this.setupLoadingMessage(next)

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
        await this.$store.dispatch('userData/fetchUserData')
        this.loadingAuth = false
        this.authCompleted = true

        this.$router.replace(next || '/ideas-cards')
      } catch (e) {
        this.loadingAuth = false
        this.expired = true
      }
    },

    updateLoadingMessage(message) {
      this.loadingMessage = message
      this.setLoadingMessage('going to Post...')
    },

    setupLoadingMessage(next) {
      if (next === '/ideas/create') {
        return this.updateLoadingMessage('going to Post...')
      }

      if (!next || !next.includes('?')) {
        return
      }

      const params = parse(next.split('?')[1])
      switch (params.aa) {
        case 'itc':
          this.updateLoadingMessage('posting your comment...')
          break
        case 'si':
          this.updateLoadingMessage('saving idea...')
          break
        case 'li':
          this.updateLoadingMessage('liking the idea...')
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.loading-img {
  width: 200px;
}
.loading-message {
  margin-top: 2rem;
  padding-left: 1rem;
  font-size: 1.5rem;
  color: #4a4759;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
