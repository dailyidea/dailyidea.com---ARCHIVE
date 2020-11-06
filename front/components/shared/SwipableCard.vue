<template>
  <card
    ref="card"
    class="swipable-card"
    :style="{ height: `calc(100vh - ${topPadding})` }"
  >
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
    topPaddingDesktop: { type: String, default: '12rem' },
    topPaddingMobile: { type: String, default: '12rem' },
    preventMobileScroll: { type: Boolean, default: true }
  },

  computed: {
    topPadding() {
      return this.$vuetify.breakpoint.mdAndDown
        ? this.topPaddingMobile
        : this.topPaddingDesktop
    }
  },

  mounted() {
    if (this.preventMobileScroll) {
      this.$refs.card.$el.addEventListener(
        'touchmove',
        this.preventScrollOnMobile
      )
    }
  },

  methods: {
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
