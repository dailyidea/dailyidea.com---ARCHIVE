<template>
  <validation-provider v-slot="{ errors }" name="Name" rules="required|max:100">
    <default-dialog
      :value="value"
      :button-ok-disabled="!name || !!errors.length"
      :button-cancel-text="buttonCancelText"
      :header="header"
      @input="v => $emit('input', v)"
      @cancel="() => $emit('cancel')"
      @ok="onOk"
    >
      <p>{{ message }}</p>
      <v-text-field
        v-model="name"
        prepend-inner-icon="fas fa-user"
        :error-messages="errors"
        label="Your Name"
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
