<template>
  <default-dialog
    :value="value"
    header="We sent a new link!"
    :subheader="`Check ${email} for a new login link.`"
    :image-path="require('assets/images/dialogs/dialog_resend.svg')"
    :button-ok-text="countDown ? `Send again in ${countDown}` : 'Send again'"
    :button-ok-disabled="!!countDown"
    button-cancel-text="Back to log in"
    @ok="resend"
    @input="v => $emit('input', v)"
  >
    <div>
      <p class="text-gray mb-1">Still having trouble?</p>
      <p>Verify the spelling, and try checking your spam folder.</p>
    </div>
  </default-dialog>
</template>

<script>
import DefaultDialog from '@/components/dialogs/DefaultDialog'

export default {
  components: {
    DefaultDialog
  },

  props: {
    value: Boolean,
    message: { type: String, default: 'Your Email?' },
    name: { type: String, default: '' },
    email: { type: String, required: true }
  },

  data: () => ({
    countDown: 30
  }),

  watch: {
    value(val) {
      if (val) {
        this.countDownTimer()
      }
    }
  },

  methods: {
    resend() {
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

<style>
.text-gray {
  color: #4c4763;
  opacity: 0.6;
}
</style>
