<template>
  <svg
    width="60"
    height="12"
    viewBox="0 0 60 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6" r="6" :fill="step == 0 ? '#5B41BB' : '#C2C2D0'" />
    <circle cx="30" cy="6" r="6" :fill="step == 1 ? '#5B41BB' : '#C2C2D0'" />
    <circle cx="54" cy="6" r="6" :fill="step == 2 ? '#5B41BB' : '#C2C2D0'" />
  </svg>
</template>

<script>
export default {
  name: 'SliderDots',
  props: {
    step: {
      type: Number,
      default: 0
    }
  }
}
</script>
