<template>
  <layout>
    <a
      role="button"
      class="d-inline-flex align-center mt-4 pl-4"
      @click="back()"
    >
      <svg
        width="8"
        height="14"
        viewBox="0 0 8 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="mr-1 mb-1"
      >
        <path d="M7 1L1 7L7 13" stroke="#4C4763" />
      </svg>
      <span>Back</span>
    </a>
    <div
      class="static-page-content min-vh100-fh pa-4 m-auto"
      style="max-width: 640px;"
    >
      <slot />
    </div>
  </layout>
</template>

<script>
import Layout from '@/components/layout/Layout'

export default {
  components: {
    Layout
  },

  methods: {
    back() {
      window.history.back()
    }
  }
}
</script>
