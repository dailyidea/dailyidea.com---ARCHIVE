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
      d="M17.2008 4.18158L17.3387 4.45918H17.6486H22C22.2761 4.45918 22.5 4.68304 22.5 4.95918V5.89796C22.5 6.1741 22.2761 6.39796 22 6.39796H6C5.72386 6.39796 5.5 6.1741 5.5 5.89796V4.95918C5.5 4.68304 5.72386 4.45918 6 4.45918H9.86486H10.1748L10.3127 4.18158L11.1478 2.5H16.3657L17.2008 4.18158Z"
      :stroke="stroke"
    />
    <path
      d="M6.95898 24V8.37756H21.0401V24C21.0401 24.8284 20.3685 25.5 19.5401 25.5H8.45898C7.63056 25.5 6.95898 24.8284 6.95898 24Z"
      :stroke="stroke"
    />
  </svg>
</template>

<script>
export default {
  name: 'TrashIcon',
  props: {
    fill: { type: String, default: String },

    stroke: { type: String, default: String }
  }
}
</script>
