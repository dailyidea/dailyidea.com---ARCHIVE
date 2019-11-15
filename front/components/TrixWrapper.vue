<template>
  <VueTrix
    :value="value"
    class="editor"
    placeholder="Enter content"
    @input="input"
  />
</template>

<script>
const VueTrix = () => import('vue-trix')

export default {
  name: 'TrixWrapper',
  components: { VueTrix },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    input(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped></style>
