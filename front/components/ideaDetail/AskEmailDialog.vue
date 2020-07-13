<template>
  <validation-observer v-slot="{ valid, validated, handleSubmit }">
    <default-dialog
      :value="value"
      :button-ok-disabled="!validated || !valid"
      :button-cancel-text="buttonCancelText"
      :header="header"
      @input="v => $emit('input', v)"
      @cancel="$emit('cancel')"
      @ok="handleSubmit(onOk)"
    >
      <p>{{ message }}</p>
      <v-text-field-with-validation
        v-model="email"
        name="Email"
        rules="required|email|max:100"
        prepend-inner-icon="email"
        label="Your Email"
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
    actionType: String,
    value: Boolean,
    header: {
      type: String,
      default: 'Introduce yourself?'
    },
    message: {
      type: String,
      default: 'Your Email?'
    },
    buttonCancelText: {
      type: String,
      default: 'Cancel'
    }
  },

  data: () => ({
    email: ''
  }),

  methods: {
    onOk() {
      this.$emit('data', this.email, this.actionType)
    }
  }
}
</script>
