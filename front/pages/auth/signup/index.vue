<template>
  <v-form>
    <v-container>
      <v-layout row>
        <v-flex>
          <p class="dash-trailing">Get Started With A Free Account.</p>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex>
          <p>To sign up, just enter your email address.</p>
          <p>We'll send you an email to confirm that the email address is yours. After that, you'll get a daily email reminder to submit your daily idea.</p>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex>
          <v-text-field v-model="email" label="Your Email Address" />
        </v-flex>
      </v-layout>
      <v-btn @click="signup">Signup</v-btn>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    email: ''
  }),
  methods: {
    async signup() {
      await this.$store.dispatch('cognito/registerUser', {
        username: this.username,
        password: this.password
      })
    }
  }
}
</script>
