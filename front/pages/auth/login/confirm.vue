<template>
  <auth-page lamp-on>
    <div class="text-center">
      <h1 class="pt-10 pb-6">Check your inbox!</h1>
      <p>
        We've sent you confirmation code to <strong>{{ email }}</strong
        >. Submit it below to complete your account set-up.
      </p>

      <div class="mt-10 px-10">
        <validation-observer v-slot="{ valid, validated, handleSubmit }">
          <v-form class="mainForm" @submit.prevent="login">
            <div class="additional-message">
              <div class="additional-message__text">{{ error }}</div>
            </div>
            <!-- Email Input Box -->
            <v-text-field-with-validation
              v-model="code"
              v-focus
              single-line
              flat
              name="Code"
              prepend-inner-icon="mdi-lock-outline"
              placeholder="The code from email"
              rules="required"
              @keydown.enter="handleSubmit(login)"
            />

            <!-- Login Button -->
            <v-btn
              type="submit"
              rounded
              block
              :disabled="!valid || !validated"
              class="mt-10"
              :loading="checkingCode"
              @click.stop.prevent="handleSubmit(login)"
              >Okay
            </v-btn>
          </v-form>
        </validation-observer>
      </div>

      <div class="mt-10">
        <p class="muted smaller">
          <a @click="showPopup">Resend code</a>
        </p>
      </div>
    </div>

    <resend-auth-email-dialog v-model="showResendEmail" :email="email" />
  </auth-page>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import AuthPage from '@/components/authPage/AuthPage'
import ResendAuthEmailDialog from '@/components/dialogs/ResendAuthEmail'
import VTextFieldWithValidation from '@/components/validation/VTextFieldWithValidation'

export default {
  name: 'Success',

  components: {
    AuthPage,
    ResendAuthEmailDialog,
    ValidationObserver,
    VTextFieldWithValidation
  },

  data: () => ({
    email: null,
    code: '',
    checkingCode: false,
    error: '',
    showResendEmail: false
  }),

  mounted() {
    if (this.$route.query.email) {
      this.email = this.$route.query.email.toLowerCase()
    }
  },

  methods: {
    showPopup() {
      this.showResendEmail = true
    },

    async login() {
      if (this.checkingCode) {
        return
      }
      this.checkingCode = true
      this.error = ''

      try {
        const resp = await this.$amplifyApi.post('LoginWithCode', '', {
          body: { email: this.email, code: this.code }
        })

        const user = await this.$store.dispatch('cognito/signInUser', {
          username: this.email
        })
        await this.$store.dispatch('cognito/answerCustomChallenge', {
          user,
          answer: resp.token
        })
        await this.$store.commit('userData/setUserIsAuthenticated')
        await this.$store.dispatch('userData/fetchUserData')

        this.$router.replace('/ideas/all')
      } catch (e) {
        if (e.response && e.response.status === 400) {
          await this.processError(e.response.data)
        }
      }
      this.checkingCode = false
    },

    async processError(data) {
      switch (data.code) {
        case 'WRONG_CODE':
          this.error =
            'Sorry this code is invalid. please try logging in again.'
          break
        case 'EXPIRED':
          this.error =
            'Sorry this code has expired. We sent you another one to the same email address.'
          await this.sendEmail()
          break
        default:
          this.error = data.message
      }
    },

    async sendEmail() {
      try {
        await this.$amplifyApi.post('RequestLogin', '', {
          body: { email: this.email, isMobile: true }
        })
      } catch (e) {
        this.$sentry.captureException(e)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';

.additional-message {
  &__text {
    color: red;
    max-width: 300px;
    margin: auto;
    min-height: 50px;
  }
}
</style>
