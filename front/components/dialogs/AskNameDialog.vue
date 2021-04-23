<template>
  <validation-observer v-slot="{ valid, validated, handleSubmit }">
    <default-dialog
      :value="value"
      :button-ok-disabled="!valid || !validated"
      :button-cancel-text="buttonCancelText"
      :show-close-button="showCloseButton"
      :persistent="persistent"
      button-ok-text="Submit"
      :header="header"
      :subheader="message"
      :image-path="require('~/assets/images/dialogs/dialog_name.svg')"
      :button-ok-loading="loading"
      @input="v => $emit('input', v)"
      @cancel="() => $emit('cancel')"
      @ok="handleSubmit(onOk)"
    >
      <v-text-field-with-validation
        v-model="name"
        prepend-inner-icon="$vuetify.icons.user"
        rules="required|max:100"
        name="Name"
        label="Your Name"
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
    header: { type: String, default: 'Almost there' },
    message: { type: String, default: 'Your Name?' },
    buttonCancelText: { type: String, default: '' },
    showCloseButton: { type: Boolean, default: true },
    persistent: { type: Boolean, default: false }
  },

  data: () => ({ name: '' }),

  methods: {
    onOk() {
      this.$emit('data', this.name)
    }
  }
}
</script>
