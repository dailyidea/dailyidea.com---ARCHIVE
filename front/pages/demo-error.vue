<template>
  <div class=""></div>
</template>

<script>
export default {
  name: 'DemoError',
  asyncData() {
    throw new Error(':(')
  }
}
</script>

<style scoped></style>
