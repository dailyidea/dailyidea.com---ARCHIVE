<template>
  <span class="link-text" :class="{ 'link-active': active }">
    <span class="text-shadow"></span>
    <span class="text">{{ text }}</span>
  </span>
</template>

<script>
export default {
  name: 'LinkText',
  props: {
    text: {
      type: String,
      required: true
    },

    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.link-active {
  color: $primary-color;
  padding-top: 0.2rem;
  position: relative;

  .text-shadow {
    position: absolute;
    bottom: 10%;
    height: 35%;

    @media (max-width: $screen-sm-max) {
      bottom: 15%;
      height: 30%;
    }

    width: 100%;
    background-color: $primary-color;
    opacity: 0.2;
  }
}
</style>
