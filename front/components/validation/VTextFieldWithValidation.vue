<template>
  <validation-provider
    v-slot="{ errors }"
    ref="provider"
    :name="$attrs.name"
    :rules="rules"
  >
    <v-text-field
      v-model="innerValue"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
    ></v-text-field>
  </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  components: { ValidationProvider },

  props: {
    rules: { type: [Object, String], default: '' },
    // must be included in props
    value: { type: null, default: '' },
    valid: Boolean
  },

  data: () => ({ innerValue: '' }),

  watch: {
    // Handles internal model changes.
    async innerValue(newVal) {
      this.$emit('input', newVal)
      const res = await this.$refs.provider.validate()
      this.$emit('update:valid', res.valid)
    },

    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal
    }
  },

  created() {
    if (this.value) {
      this.innerValue = this.value
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .v-input__prepend-inner {
    padding-right: 14px !important;
  }
}
</style>
