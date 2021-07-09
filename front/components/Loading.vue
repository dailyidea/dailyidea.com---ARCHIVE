<template>
  <div v-if="enabled && loading" class="loading-page">
    <img
      class="loading-image"
      :src="image || require('~/assets/images/general/loading.gif')"
      alt="Loading"
      width="197"
    />
    <div class="caption">{{ message || 'loading...' }}</div>
    <div class="quote">
      <div class="quote-text">"{{ quote }}"</div>
      <div>
        <img src="~assets/images/icons/lamp.svg" alt="" />
        {{ author }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import qoutes from '../../back/common/qoutes.json'

export default {
  data: () => ({
    quote: '',
    author: ''
  }),

  computed: {
    ...mapState({
      loading: s => s.routerLoading,
      enabled: s => s.routerLoadingEnabled,
      message: s => s.loadingMessage,
      image: s => s.loadingImage
    })
  },

  mounted() {
    this.setQoute()
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
      this.setQoute()
    },

    finish() {
      setTimeout(() => {
        this.setRouterLoading(false)
        this.setRouterLoadingEnabled(true)
        this.setLoadingMessage(null)
        this.setLoadingImage(null)
      }, 1000)
    },

    setQoute() {
      const qoutesFiltered = qoutes.filter(q => q.include)
      const qoute =
        qoutesFiltered[Math.floor(Math.random() * qoutesFiltered.length)]
      this.quote = qoute.quote
      this.author = qoute.author
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
.quote {
  max-width: 640px;
  margin-top: 2rem;
  padding: 0 1rem;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: rgba(76, 71, 99, 0.6);
}
.quote-text {
  margin-bottom: 0.5rem;
}
</style>
