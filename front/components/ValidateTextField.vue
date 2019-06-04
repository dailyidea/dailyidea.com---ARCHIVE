<template>
  <v-text-field
    :id="name"
    v-model.trim="localValue"
    v-validate="validate"
    :name="name"
    :label="labelDisplay"
    :data-vv-name="name"
    :error-messages="
      field && (field.dirty || field.validated) && errors.has(fieldName)
        ? errors.collect(fieldName)
        : undefined
    "
    :data-vv-as="labelDisplay"
    v-bind="$attrs"
    :data-vv-scope="scope"
    data-vv-validate-on="blur"
    @input="$emit('update:value', localValue)"
    @keyup="$emit('keyup', $event)"
  />
</template>

<script>
export default {
  inject: ['$validator'],
  name: 'ValidateTextField',
  props: {
    scope: {
      type: String,
      default: undefined
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: null
    },
    validate: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localValue: this.value
    }
  },
  computed: {
    labelDisplay() {
      return this.label === null
        ? this.name[0].toUpperCase() + this.name.slice(1)
        : this.label
    },
    fieldName() {
      if (this.scope) {
        return `${this.scope}.${this.name}`
      } else {
        return this.name
      }
    },
    field() {
      if (this.scope) {
        return (this.fields[`$` + this.scope] || {})[this.name]
      } else {
        return this.fields[this.name]
      }
    }
  },
  watch: {
    value: {
      handler: function(v) {
        this.localValue = v
      }
    }
  }
}
</script>
