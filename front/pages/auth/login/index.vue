<template>
  <auth-page>
    <v-form class="mainForm" @submit.prevent="login">
      <div class="additional-message">
        <div class="additional-message__text">
          {{ additionalMessageText }}
        </div>
      </div>
      <!-- Email Input Box -->
      <validate-text-field
        v-focus
        :value.sync="email"
        single-line
        flat
        name="email"
        autocomplete="email"
        type="email"
        prepend-inner-icon="mdi-email-outline"
        placeholder="What is your email address?"
        validate="required|email"
      />

      <!-- Email Not Found Message -->
      <div v-if="emailNotFoundMsg !== ''" class="red--text smaller">
        {{ emailNotFoundMsg }}
      </div>

      <!-- Login Button -->
      <v-btn
        type="submit"
        rounded
        block
        class="mt-10"
        :loading="logingUser"
        @click.stop.prevent="login"
        >Log In
      </v-btn>
    </v-form>

    <div class="text-center pt-6">
      <div class="muted smaller">
        Don't have an account yet?
        <nuxt-link class="signupBtn" text to="/auth/signup"
          >Create Account</nuxt-link
        >
      </div>
    </div>
  </auth-page>
</template>

<script>
import AuthPage from '@/components/authPage/AuthPage'
import ValidateTextField from '~/components/ValidateTextField'
import ActionValidate from '~/mixins/validatable'

const DEFAULT_ERROR_MESSAGE =
  "Oops, you're not logged in. Please log in first to proceed"

const AdditionalMessages = {
  '/ideas/create':
    "Oops, you're not logged in. Please log in first to enter an idea."
}

export default {
  name: 'Index',
  components: { AuthPage, ValidateTextField },
  $_veeValidate: { validator: 'new' },
  mixins: [ActionValidate],
  data: () => ({
    email: '',
    logingUser: false,
    emailNotFoundMsg: ''
  }),

  computed: {
    additionalMessageText() {
      if (this.$route.query && this.$route.query.r) {
        const additionalMessage = AdditionalMessages[this.$route.query.r]
        if (additionalMessage) {
          return additionalMessage
        } else {
          return DEFAULT_ERROR_MESSAGE
        }
      }
      return ''
    }
  },

  methods: {
    async login() {
      if (this.logingUser) {
        return
      }
      try {
        this.logingUser = true
        this.emailNotFoundMsg = ''

        // Validate input fields
        const result = await this.$validator.validateAll()
        if (!result) {
          this.logingUser = false
          return
        }

        await this.$amplifyApi.post('RequestLogin', '', {
          body: { email: this.email.toLowerCase(), next: this.$route.query.r }
        })

        // Redirect to login success page
        this.$router.push({
          name: 'auth-login-success',
          query: { email: this.email.toLowerCase() }
        })
      } catch (e) {
        this.logingUser = false

        // Handle email not found
        if (e.response && e.response.data.message === 'Email not found') {
          this.emailNotFoundMsg =
            "Sorry, we can't find an account with this email address. Do you want to"
          return
        }
        this.logingUser = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.mainForm {
  max-width: 420px;
  margin: auto;
  display: block;
  padding: 5px 20px;
}

.additional-message {
  &__text {
    color: #777777;
    max-width: 300px;
    margin: auto;
    min-height: 50px;
  }
}

form ::v-deep .v-input__prepend-inner {
  padding-right: 15px !important;
  i {
    font-size: 18px;
    color: $primary-color;
  }
}
</style>
