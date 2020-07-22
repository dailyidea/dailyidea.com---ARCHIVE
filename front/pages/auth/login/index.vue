<template>
  <auth-page>
    <validation-observer v-slot="{ valid, validated, handleSubmit }">
      <v-form class="mainForm" @submit.prevent="login">
        <div class="additional-message">
          <div class="additional-message__text">
            {{ additionalMessageText }}
          </div>
        </div>
        <!-- Email Input Box -->
        <v-text-field-with-validation
          v-model="email"
          v-focus
          single-line
          flat
          name="Email"
          autocomplete="email"
          type="email"
          prepend-inner-icon="mdi-email-outline"
          placeholder="What is your email address?"
          rules="required|email"
          @keydown.enter="handleSubmit(login)"
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
          :disabled="!valid || !validated"
          class="mt-10"
          :loading="logingUser"
          @click.stop.prevent="handleSubmit(login)"
          >Log In
        </v-btn>
      </v-form>
    </validation-observer>

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
import { ValidationObserver } from 'vee-validate'
import AuthPage from '@/components/authPage/AuthPage'
import VTextFieldWithValidation from '@/components/validation/VTextFieldWithValidation'

const DEFAULT_ERROR_MESSAGE =
  "Oops, you're not logged in. Please log in first to proceed"

const AdditionalMessages = {
  '/ideas/create':
    "Oops, you're not logged in. Please log in first to enter an idea."
}

export default {
  name: 'Index',
  components: { VTextFieldWithValidation, AuthPage, ValidationObserver },
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
    },

    isMobile() {
      return this.$vuetify.breakpoint.width < 600 // TODO refactor into mixin
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

        await this.$amplifyApi.post('RequestLogin', '', {
          body: {
            email: this.email.toLowerCase(),
            next: this.$route.query.r,
            isMobile: this.isMobile
          }
        })

        // Redirect to login success page
        this.$router.push({
          name: this.isMobile ? 'auth-login-confirm' : 'auth-login-success',
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
