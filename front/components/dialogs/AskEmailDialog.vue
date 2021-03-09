<template>
  <validation-observer v-slot="{ valid, validated, handleSubmit }">
    <default-dialog
      button-ok-text="Submit"
      :value="value"
      :button-ok-disabled="!validated || !valid"
      :button-cancel-text="buttonCancelText"
      :show-close-button="showCloseButton"
      :persistent="persistent"
      :header="header"
      :subheader="message"
      :image-path="require('assets/images/dialogs/dialog_email.svg')"
      :button-ok-loading="loading"
      @input="v => $emit('input', v)"
      @cancel="$emit('cancel')"
      @ok="handleSubmit(onOk)"
    >
      <v-text-field-with-validation
        v-model="email"
        name="Email"
        rules="required|email|max:100"
        prepend-inner-icon="$vuetify.icons.mail"
        label="Your email address"
        @keydown.enter="handleSubmit(onOk)"
      ></v-text-field-with-validation>
    </default-dialog>
  </validation-observer>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import DefaultDialog from '@/components/dialogs/DefaultDialog'
import VTextFieldWithValidation from '@/components/validation/VTextFieldWithValidation'

export default {
  components: {
    VTextFieldWithValidation,
    ValidationObserver,
    DefaultDialog
  },

  props: {
    value: Boolean,
    loading: Boolean,
    header: { type: String, default: 'What’s your email?' },
    message: { type: String, default: 'Your Email?' },
    buttonCancelText: { type: String, default: 'Cancel' },
    showCloseButton: { type: Boolean, default: true },
    persistent: { type: Boolean, default: false }
  },

  data: () => ({ email: '' }),

  methods: {
    onOk() {
      this.$emit('data', this.email)
    }
  }
}
</script>
