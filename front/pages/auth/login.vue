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
          <p>To log in to your email account, enter the email address for your account below.</p>
          <p>You'll get an email that contains a login link that will automatically log you in to the site.</p>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex>
          <v-text-field v-model="email" label="Your Email Address" />
        </v-flex>
      </v-layout>
      <v-btn @click="login">Login</v-btn>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    email: ''
  }),
  methods: {
    async login() {
      try {
        this.$amplifyApi.post('RequestLogin', '', {
          body: { email: this.email }
        })
      } catch (e) {
        //
      }
    }
  }
}
</script>
