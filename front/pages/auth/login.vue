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
          <p>
            To log in to your email account, enter the email address for your
            account below.
          </p>
          <p>
            You'll get an email that contains a login link that will
            automatically log you in to the site.
          </p>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex>
          <validate-text-field
            :value.sync="email"
            name="email"
            autocomplete="email"
            type="email"
            placeholder="null@example.com"
            validate="required|email"
          />
        </v-flex>
      </v-layout>
      <v-layout>
        <v-btn block @click="actionValidate(login)">Login</v-btn>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import ValidateTextField from '../../components/ValidateTextField'
import ActionValidate from '~/mixins/validatable'
import { getErrorMessage } from '~/utils'

export default {
  components: { ValidateTextField },
  $_veeValidate: { validator: 'new' },
  mixins: [ActionValidate],
  data: () => ({
    email: ''
  }),
  methods: {
    async login() {
      try {
        await this.$amplifyApi.post('RequestLogin', '', {
          body: { email: this.email }
        })
        this.$snotify.success('Email Sent', 'Email Sent', {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        })
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
