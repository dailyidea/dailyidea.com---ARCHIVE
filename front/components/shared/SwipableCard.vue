<template>
  <card ref="card" class="swipable-card" :style="{ height: `${height}px` }">
    <slot />
  </card>
</template>

<script>
import Card from '@/components/shared/Card'

export default {
  components: {
    Card
  },

  props: {
    paddingBottom: { type: Number, default: 0 },
    preventMobileScroll: { type: Boolean, default: true },
    autoHeight: { type: Boolean, default: true }
  },

  data: () => ({
    height: '100%'
  }),

  mounted() {
    if (this.preventMobileScroll) {
      this.$refs.card.$el.addEventListener(
        'touchmove',
        this.preventScrollOnMobile
      )
    }
    if (this.autoHeight) {
      this.$nextTick(() => this.calcHeight())
      setTimeout(() => this.calcHeight(), 200)
      window.addEventListener('resize', this.calcHeight)
    }
  },

  destroyed() {
    if (this.autoHeight) {
      window.removeEventListener('resize', this.calcHeight)
    }
  },

  methods: {
    getHeight(selector) {
      const el = window.document.querySelector(selector)
      if (el) {
        return el.clientHeight
      }
      return 0
    },

    calcHeight() {
      let reduceby = 0
      reduceby += this.getHeight('.swipe-header')
      reduceby += this.getHeight('.desktop-header')
      reduceby += this.getHeight('.header-sub-container')
      reduceby += this.getHeight('.sticky-footer')

      this.height =
        window.innerHeight -
        reduceby -
        window.innerWidth / 20 -
        this.paddingBottom
    },

    preventScrollOnMobile(event) {
      if (this.preventMobileScroll) {
        event.preventDefault()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.swipable-card {
  margin: 0 auto;
  overflow: hidden;
  width: 100%;

  @media (min-width: $screen-md-min) {
    min-width: 70vw;
    max-width: 70vw;
    left: calc(50% - 35vw);
  }
}
</style>
