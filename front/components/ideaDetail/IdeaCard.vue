<template>
  <v-row
    ref="page"
    align="stretch"
    :class="{ 'fixed-height': !isExpanded }"
    class="elevation-2 ma-1 card"
  >
    <div class="tap-bar" @click="expandToggle"></div>
    <slot></slot>
  </v-row>
</template>

<script>
export default {
  name: 'IdeaCard',
  props: {
    expanded: Boolean
  },
  data() {
    return {
      isExpanded: this.expanded === undefined ? false : this.expanded
    }
  },
  mounted() {
    // Disable vertical scroll if card is not expanded
    this.$refs.page.addEventListener(
      'touchmove',
      this.preventScrollOnMobileWhenCardIsNotExpanded
    )
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
  padding: 1rem;
  background-color: white;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;

  @media only screen and (min-width: $screen-md-min) {
    margin: 0 auto !important;
    margin-top: 10vh !important;
    width: 65vw;
    height: 60vh;
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
