<template>
  <default-dialog
    :value="value"
    :header="name ? `Welcome Back ${name}!` : 'Welcome to Daily Idea!'"
    :subheader="message"
    :image-path="require('assets/images/dialogs/dialog_welcome_back.svg')"
    :button-ok-text="`Send again in ${countDown}`"
    @input="v => $emit('input', v)"
  >
    <div class="text-center">
      <gmail-search-btn
        :email="email"
        search="[Daily+Idea]+Log+in+link"
        class="mb-6"
      />
    </div>
    <template v-slot:footer>
      <p v-if="showResend" class="text-center">
        <a href="#" class="link-highlight" @click.prevent="resend"
          >Request a new link to wbarryux@gmail.com</a
        >
      </p>
    </template>
  </default-dialog>
</template>

<script>
import DefaultDialog from '@/components/dialogs/DefaultDialog'
import GmailSearchBtn from '@/components/shared/GmailSearchBtn'

export default {
  components: {
    GmailSearchBtn,
    DefaultDialog
  },

  props: {
    value: Boolean,
    message: { type: String, default: 'Your Email?' },
    name: { type: String, default: '' },
    email: { type: String, required: true }
  },

  data: () => ({
    resendTimeout: 20000,
    countDown: 20,
    showResend: false
  }),

  watch: {
    value(val) {
      if (val) {
        setTimeout(() => (this.showResend = true), this.resendTimeout)
        this.countDownTimer()
      }
    }
  },

  methods: {
    resend() {
      this.showResend = false
      setTimeout(() => (this.showResend = true), this.resendTimeout)
      this.$emit('resend')
      this.countDownTimer()
    },

    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1
          this.countDownTimer()
        }, 1000)
      }
    }
  }
}
</script>
