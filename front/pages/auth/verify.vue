<template>
  <v-form>
    <v-container>
      <v-layout row>
        <v-flex>{{ error }}</v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    error: ''
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
        this.error = e.message
      }
    }
  }
}
</script>
