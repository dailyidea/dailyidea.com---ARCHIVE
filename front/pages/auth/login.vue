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
            <p>To log in to your email account, enter the email address for your account below.</p>
            <p>You'll get an email that contains a login link that will automatically log you in to the site.</p>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex>
            <v-text-field v-model="email" label="Your Email Address" />
          </v-flex>
        </v-layout>
        <v-layout>
          <v-btn block @click="login">Login</v-btn>
        </v-layout>
      </template>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    email: '',
    success: false
  }),
  methods: {
    async login() {
      try {
        await this.$amplifyApi.post('RequestLogin', '', {
          body: { email: this.email }
        })
        this.success = true
      } catch (e) {
        let err
        if (e.response && e.response.data && e.response.data.message) {
          err = e.response.data.message
        } else {
          err = e
        }
        this.$snotify.error(err, 'Error', {
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
