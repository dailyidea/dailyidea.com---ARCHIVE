<template>
  <v-row
    ref="page"
    align="stretch"
    :class="{ 'fixed-height': !isExpanded, 'full-height': isExpanded }"
    class="elevation-2 ma-1 card"
    @click="expandToggle"
  >
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
  /* .rounded doesn't work because i'm applying this to a .row (which i shouldn't) */
}

.fixed-height {
  max-height: 70vh;
  overflow-y: hidden;
}

.full-height {
  height: 100%;
}
</style>
