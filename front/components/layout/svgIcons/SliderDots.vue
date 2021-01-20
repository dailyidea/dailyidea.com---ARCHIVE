<template>
  <svg
    :width="12 + 24 * (total - 1)"
    height="12"
    :viewBox="`0 0 ${12 + 24 * (total - 1)} 12`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      v-for="n in range(total)"
      :key="n"
      :cx="6 + 24 * n"
      cy="6"
      r="6"
      :fill="step === n ? '#5B41BB' : '#C2C2D0'"
    />
  </svg>
</template>

<script>
import range from 'lodash/range'

export default {
  props: {
    step: { type: Number, required: true },
    total: { type: Number, required: true }
  },

  methods: {
    range
  }
}
</script>
