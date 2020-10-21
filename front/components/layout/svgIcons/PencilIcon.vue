<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 0H0V24H24V0Z" :fill="fill" />
    <path
      d="M5.43982 22.5H1.5V18.5602L14.4761 5.5841L18.4159 9.52392L5.43982 22.5ZM16.5773 3.48292L18.1622 1.89798C18.6928 1.36734 19.5532 1.36734 20.0838 1.89797L22.102 3.9162C22.6327 4.44683 22.6327 5.30716 22.102 5.83779L20.5171 7.42274L16.5773 3.48292Z"
      :stroke="stroke"
      stroke-width="1.1"
    />
  </svg>
</template>

<script>
export default {
  name: 'PencilIcon',
  props: {
    fill: { type: String, default: String },

    stroke: { type: String, default: String }
  }
}
</script>
