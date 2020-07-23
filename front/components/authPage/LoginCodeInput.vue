<template>
  <div>
    <validation-provider v-slot="{ errors }" :name="name" :rules="rules">
      <client-only>
        <pincode-input
          :value="value"
          :length="digits"
          @input="v => $emit('input', v)"
        />
      </client-only>
      <div v-if="errors.length" class="mt-2 error--text">{{ errors[0] }}</div>
    </validation-provider>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import PincodeInput from 'vue-pincode-input'

export default {
  components: { PincodeInput, ValidationProvider },

  props: {
    value: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: 'Code'
    },
    rules: {
      type: String,
      default: void 0
    },
    digits: {
      type: Number,
      default: 4
    }
  },

  watch: {
    value(val) {
      if (val.length === this.digits) {
        this.$emit('complete')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep input.vue-pincode-input {
  max-width: 30px;
  margin: 3px 10px;
  box-shadow: none;
  border-bottom: 2px solid #8b8892;
  border-radius: 0;
  font-size: 1.3rem;
}
</style>
