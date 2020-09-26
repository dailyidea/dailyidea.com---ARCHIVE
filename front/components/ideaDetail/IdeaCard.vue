<template>
  <v-row
    ref="page"
    align="stretch"
    :class="{ 'fixed-height': !isExpanded && !preview }"
    class="elevation-2 ma-1 card"
    :style="additionalStyling"
  >
    <div class="tap-bar" @click="expandToggle"></div>
    <slot :expand-toggle="expandToggle"></slot>
  </v-row>
</template>

<script>
export default {
  name: 'IdeaCard',
  props: {
    allowMobileScroll: Boolean,
    expanded: Boolean,
    preview: Boolean,
    additionalStyling: {
      type: Object,
      default: Object
    }
  },
  data() {
    return {
      isExpanded: this.expanded === undefined ? false : this.expanded
    }
  },
  mounted() {
    // Disable vertical scroll if card is not expanded
    if (!this.allowMobileScroll) {
      this.$refs.page.addEventListener(
        'touchmove',
        this.preventScrollOnMobileWhenCardIsNotExpanded
      )
    }
  },
  methods: {
    preventScrollOnMobileWhenCardIsNotExpanded(event) {
      if (this.isExpanded === false) {
        event.preventDefault()
      } else {
        return true
      }
    },
    expandToggle() {
      this.isExpanded = !this.isExpanded
      this.$emit('expand-toggle')
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  border: 1px solid $light-grey !important;
  box-shadow: $card-shadow !important;
  overflow: hidden;

  @media only screen and (min-width: $screen-md-min) {
    margin: 0 auto !important;
    margin-top: 2vh !important;

    .fixed-height {
      min-height: 80vh;
    }
  }

  /* .rounded doesn't work because i'm applying this to a .row (which i shouldn't) */
}

@media only screen and (max-width: $screen-sm-max) {
  .fixed-height {
    overflow-y: hidden;
  }

  .tap-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10%;
    z-index: 100;
  }
}
</style>
