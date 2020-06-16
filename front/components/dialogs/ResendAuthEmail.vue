<template>
  <default-dialog
    :value="value"
    :button-ok-disabled="sendingEmail || blockSendAgainTime > 0"
    button-cancel-text="Back To Log in"
    :button-ok-text="sendAgainText"
    header="Didn't get a confirmation email?"
    @input="closeDialog"
    @cancel="backToLogIn"
    @ok="sendEmail"
  >
    <div class="emailSentMessage">
      <span v-if="sendingEmail"
        >Sending another email to <strong>{{ email }}</strong
        >...</span
      >
      <span v-else>
        We've sent another login email to you at <strong>{{ email }}</strong
        >. Make sure the email address is spelled correctly, and try checking
        your spam or junk folder. Click <strong>Back to Log In</strong> and
        input correct email if you have mistaken.
      </span>
    </div>
  </default-dialog>
</template>

<script>
import DefaultDialog from '@/components/dialogs/DefaultDialog'

export default {
  components: { DefaultDialog },

  props: {
    value: Boolean,
    email: {
      type: String,
      default: undefined
    }
  },

  data: () => ({
    sendingEmail: true,
    sent: false,
    error: false,
    blockSendAgainTime: 0
  }),

  computed: {
    sendAgainText() {
      let msg = 'Send again'
      if (this.blockSendAgainTime > 0) {
        msg += ` ${this.blockSendAgainTime}`
      }
      return msg
    }
  },

  watch: {
    value(val) {
      if (val) {
        this.sendEmail()
      }
    }
  },

  methods: {
    resetData() {
      this.sent = false
      this.error = false
    },

    execDecreaseTimer() {
      this.blockSendAgainTime--
      if (this.blockSendAgainTime > 0) {
        setTimeout(this.execDecreaseTimer, 1000)
      }
    },

    async sendEmail() {
      this.sendingEmail = true
      try {
        await this.$amplifyApi.post('RequestLogin', '', {
          body: { email: this.email }
        })
        this.sent = true
        this.blockSendAgainTime = 31
        this.execDecreaseTimer()
      } catch (e) {
        this.$sentry.captureException(e)
        this.error = true
      }
      this.sendingEmail = false
    },

    closeDialog() {
      this.$emit('input', false)
      this.resetData()
    },

    backToLogIn() {
      this.closeDialog()
      setTimeout(() => this.$router.push('/auth/login'), 300)
    }
  }
}
</script>

<style scoped lang="scss">
.emailSentMessage {
  text-align: justify;
  color: #777777;
}
</style>
