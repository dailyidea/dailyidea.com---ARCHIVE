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
          <p>Resend Confirmation Email TODO TEXT.</p>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex>
          <v-text-field v-model="email" label="Your Email Address" />
        </v-flex>
      </v-layout>
      <v-btn @click="signup">Resend Confirmation Email</v-btn>
    </v-container>
  </v-form>
</template>

<script>
import nanoid from 'nanoid'
export default {
  data: () => ({
    email: ''
  }),
  methods: {
    async signup() {
      await this.$store.dispatch('cognito/resendConfirmation', {
        username: this.email
      })
    }
  }
}
</script>
