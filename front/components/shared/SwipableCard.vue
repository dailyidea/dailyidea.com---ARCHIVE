<template>
  <card
    ref="card"
    class="swipable-card"
    :class="{ expanded: expandIn, 'expand-out': expandOut }"
    :style="styles"
  >
    <a v-if="expandIn" class="back-btn" role="button" @click="$emit('collapse')"
      ><svg
        style="margin-bottom: -3px;"
        width="10"
        height="18"
        viewBox="0 0 10 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9 1L1 9L9 17" stroke="#5B41BB" />
      </svg>
      back</a
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
    width: { type: String, default: '669px' },
    marginTop: { type: Number, default: 0 },
    paddingBottom: { type: Number, default: 0 },
    preventMobileScroll: { type: Boolean, default: false },
    autoHeight: { type: Boolean, default: true },
    expanded: Boolean
  },

  data: () => ({
    height: '100%',
    expandIn: false,
    expandOut: false,
    initialIset: ''
  }),

  computed: {
    styles() {
      const styles = {
        marginTop: `${this.marginTop}px`,
        height: this.height,
        width: this.width
      }
      if (!this.$refs.card) {
        return styles
      }
      if (this.expanded) {
        styles.height = document.documentElement.clientHeight + 'px'
      }
      if (this.expanded || this.expandOut) {
        Object.assign(styles, {
          position: 'fixed',
          inset: this.initialInset
        })
      }

      return styles
    }
  },

  watch: {
    expanded(val) {
      // Some delay to prerape animation initial position
      if (val) {
        const bounds = this.$refs.card.$el.getBoundingClientRect()
        this.initialInset = `0 ${bounds.right - bounds.width}px ${
          bounds.bottom
        }px ${bounds.left}px`

        setTimeout(() => (this.expandIn = true), 10)
      } else {
        this.expandIn = false
        this.expandOut = true
        setTimeout(() => {
          this.expandOut = false
          this.$emit('expanded-transition-end')
        }, 510)
      }
    }
  },

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
        this.paddingBottom -
        this.marginTop +
        'px'
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
  width: auto;
  transition: inset 0.5s ease, height 0.5s ease;

  @media (min-width: $screen-md-min) {
    left: calc(50% - 334px);
  }

  @media (max-width: $screen-sm-max) {
    width: auto !important;
    margin: 0 10px;
  }

  &.expanded {
    z-index: 20;
    inset: -61px 0 0 0 !important;
    width: auto !important;
    // height: 100vh !important;
    margin: 0;

    @media (min-width: $screen-md-min) {
      height: calc(100vh - 64px) !important;
    }
  }

  &.expand-out {
    z-index: 20;
    width: auto !important;
    margin: 0;
  }
}

.back-btn {
  display: block;
  margin-bottom: 10px;

  @media (min-width: $screen-md-min) {
    position: absolute;
    left: 10%;
    margin-top: 20px;
  }
}
</style>
