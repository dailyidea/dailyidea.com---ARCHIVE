<template>
  <validation-provider
    v-slot="{ errors }"
    name="Email"
    rules="required|email|max:100"
  >
    <default-dialog
      :show="show"
      :button-ok-disabled="!email || !!errors.length"
      :button-cancel-text="buttonCancelText"
      :header="header"
      @hide="$emit('hide')"
      @cancel="$emit('cancel')"
      @ok="onOk"
    >
      <p>{{ message }}</p>
      <v-text-field
        v-model="email"
        prepend-inner-icon="email"
        :error-messages="errors"
        label="Your Email"
        @keydown.enter="onOk"
      ></v-text-field>
    </default-dialog>
  </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import DefaultDialog from '@/components/dialogs/DefaultDialog'

export default {
  components: {
    ValidationProvider,
    DefaultDialog
  },

  props: {
    show: Boolean,
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
      this.$emit('data', this.email)
    }
  }
}
</script>
