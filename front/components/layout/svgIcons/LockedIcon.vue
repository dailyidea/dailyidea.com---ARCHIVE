<template>
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="28" height="28" :fill="fill" />
    <path
      d="M18.5 10.6522V7.5C18.5 5.01472 16.4853 3 14 3V3C11.5147 3 9.5 5.01472 9.5 7.5V10.1739"
      :stroke="stroke"
      stroke-width="1.1"
    />
    <path
      d="M4.5 23V11.6957C4.5 10.8673 5.17157 10.1957 6 10.1957H22C22.8284 10.1957 23.5 10.8673 23.5 11.6957V23C23.5 23.8285 22.8284 24.5 22 24.5H6C5.17157 24.5 4.5 23.8285 4.5 23Z"
      :stroke="stroke"
      stroke-width="1.1"
    />
    <path
      d="M16.5 17.3478C16.5 18.6358 15.4019 19.7174 14 19.7174C12.5981 19.7174 11.5 18.6358 11.5 17.3478C11.5 16.0599 12.5981 14.9783 14 14.9783C15.4019 14.9783 16.5 16.0599 16.5 17.3478Z"
      :stroke="stroke"
      stroke-width="1.1"
    />
  </svg>
</template>

<script>
export default {
  name: 'LockedIcon',
  props: {
    fill: { type: String, default: String },

    stroke: { type: String, default: String }
  }
}
</script>
