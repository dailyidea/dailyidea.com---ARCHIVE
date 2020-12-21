<template>
  <div v-if="loading" class="loading-page">
    <img
      class="loading-image"
      src="~assets/images/general/loading.gif"
      alt="Loading"
      width="197"
    />
    <div class="caption">loading...</div>
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
}
.caption {
  margin-top: 2rem;
  padding-left: 1rem;
  font-size: 1.5rem;
  color: #4a4759;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
