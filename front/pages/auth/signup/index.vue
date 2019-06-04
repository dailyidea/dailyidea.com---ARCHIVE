<template>
  <v-form>
    <v-container>
      <v-layout row>
        <v-flex>
          <p class="dash-trailing">Get Started With A Free Account.</p>
        </v-flex>
      </v-layout>
      <template v-if="!success">
        <v-layout row>
          <v-flex>
            <p>To sign up, just enter your email address.</p>
            <p>
              We'll send you an email to confirm that the email address is
              yours. After that, you'll get a daily email reminder to submit
              your daily idea.
            </p>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex>
            <v-text-field v-model="email" label="Your Email Address" />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-btn block @click="signup">Signup</v-btn>
        </v-layout>
        <v-layout row justify-center>
          <nuxt-link :to="{ name: 'auth-signup-resend' }"
            >Resend Confirmation Email</nuxt-link
          >
        </v-layout>
      </template>
      <template v-else>
        <v-layout row>
          <v-flex>
            <p>Confirmation email was sent to email.</p>
          </v-flex>
        </v-layout>
      </template>
    </v-container>
  </v-form>
</template>

<script>
import nanoid from 'nanoid'
import { getErrorMessage } from '~/utils'
export default {
  data: () => ({
    email: '',
    success: false
  }),
  methods: {
    async signup() {
      try {
        await this.$store.dispatch('cognito/registerUser', {
          username: this.email,
          password: nanoid()
        })
        this.success = true
      } catch (e) {
        this.$snotify.error(getErrorMessage(e), 'Error', {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        })
      }
    }
  }
}
</script>
