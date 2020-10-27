<template>
  <div
    ref="card"
    class="elevation-2 ma-1 card"
    :style="additionalStyling"
    @click="e => $emit('click', e)"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    lightboxMode: Boolean,
    additionalStyling: { type: [Object, String], default: Object },
    preventMobileScroll: { type: Boolean, default: false }
  },

  mounted() {
    if (this.preventMobileScroll) {
      this.$refs.card.addEventListener('touchmove', this.preventScrollOnMobile)
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
.card {
  position: relative;
  padding: 1rem;
  height: 100%;
  background-color: white;
  border-radius: 8px;
  border: 1px solid $light-grey !important;
  box-shadow: $card-shadow !important;

  @media only screen and (min-width: $screen-md-min) {
    margin: 0 auto !important;
  }
}

@media only screen and (max-width: $screen-sm-max) {
  .fixed-height {
    overflow-y: hidden;
  }
}
</style>
