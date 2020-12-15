<template>
  <div v-if="loading" class="loading-page">
    <img
      src="~assets/images/general/loading.gif"
      alt="Loading"
      width="395"
      height="396"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),

  methods: {
    start() {
      this.loading = true
    },

    finish() {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.loading-page {
  position: fixed;
  z-index: 9999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
}
</style>
