<template>
  <!-- eslint-disable vue/no-v-html -->
  <div v-html="content"></div>
</template>

<script>
export default {
  name: 'IdeaContent',
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped></style>
