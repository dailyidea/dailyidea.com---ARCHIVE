<template>
  <div v-if="enabled && loading" class="loading-page">
    <img
      class="loading-image"
      :src="image || require('~/assets/images/general/loading.gif')"
      alt="Loading"
      width="197"
    />
    <div class="caption">{{ message || 'loading...' }}</div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      loading: s => s.routerLoading,
      enabled: s => s.routerLoadingEnabled,
      message: s => s.loadingMessage,
      image: s => s.loadingImage
    })
  },

  methods: {
    ...mapMutations({
      setRouterLoading: 'SET_ROUTER_LOADING',
      setRouterLoadingEnabled: 'SET_ROUTER_LOADING_ENABLED',
      setLoadingMessage: 'SET_LOADING_MESSAGE',
      setLoadingImage: 'SET_LOADING_IMAGE'
    }),

    start() {
      this.setRouterLoading(true)
    },

    finish() {
      setTimeout(() => {
        this.setRouterLoading(false)
        this.setRouterLoadingEnabled(true)
        this.setLoadingMessage(null)
        this.setLoadingImage(null)
      }, 1000)
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
