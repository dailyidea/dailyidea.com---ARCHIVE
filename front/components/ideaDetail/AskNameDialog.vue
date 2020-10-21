<template>
  <validation-observer v-slot="{ valid, validated, handleSubmit }">
    <default-dialog
      :value="value"
      :button-ok-disabled="!valid || !validated"
      :button-cancel-text="buttonCancelText"
      :header="header"
      :image-path="require('~/assets/images/dialogs/undraw_inbox_oppv.svg')"
      @input="v => $emit('input', v)"
      @cancel="() => $emit('cancel')"
      @ok="handleSubmit(onOk)"
    >
      <p>{{ message }}</p>
      <v-text-field-with-validation
        v-model="name"
        prepend-inner-icon="fas fa-user"
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
    header: {
      type: String,
      default: 'Almost there'
    },
    message: {
      type: String,
      default: 'Your Name?'
    },
    buttonCancelText: {
      type: String,
      default: 'Cancel'
    }
  },

  data: () => ({
    name: ''
  }),

  methods: {
    onOk() {
      this.$emit('data', this.name)
    }
  }
}
</script>
