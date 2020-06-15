<template>
  <div class="swipe-parent">
    <div ref="swipe" :style="position" class="swipe-container">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Swiper',
  data() {
    return {
      tapping: false,
      xStart: 0,
      yStart: 0,
      xVal: 0,
      yVal: 0,
      rotationVal: 0,
      position: {
        left: '',
        top: '',
        transform: ''
      }
    }
  },
  computed: {
    x: {
      set(val) {
        this.setLeft(val)
        this.xVal = val
      },

      get() {
        return this.xVal
      }
    },

    y: {
      set(val) {
        this.setTop(val)
        this.yVal = val
      },

      get() {
        return this.yVal
      }
    },

    rotation: {
      set(val) {
        this.setRotation(val)
        this.rotationVal = val
      },

      get() {
        return this.rotationVal
      }
    }
  },
  mounted() {
    this.setupTouchListener()
  },
  methods: {
    setLeft(val) {
      this.position.left = `${val}px`
    },
    setTop(val) {
      this.position.top = `${val}px`
    },
    setRotation(val) {
      this.position.transform = `rotate(${val}deg)`
    },
    getPos(event) {
      const x = event.touches[0].clientX
      const y = event.touches[0].clientY

      return {
        x: x - event.srcElement.clientWidth / 2,
        y: y - event.srcElement.clientHeight
      }
    },
    setPos(event) {
      const { x, y } = this.getPos(event)
      this.x = x
      this.y = y
    },
    fingerDown(event) {
      this.tapping = true
      const { x, y } = this.getPos(event)
      this.xStart = x
      this.yStart = y
      this.setPos(event)
    },
    fingerUp(event) {
      this.tapping = false
      if (this.x > this.xStart + 100) {
        this.$emit('right')
      } else if (this.x < this.xStart - 100) {
        this.$emit('left')
      }

      this.x = 0
      this.y = 0
    },
    fingerMove(event) {
      if (!this.tapping) return
      this.setPos(event)
    },
    setupTouchListener() {
      this.$refs.swipe.addEventListener('touchstart', this.fingerDown)
      this.$refs.swipe.addEventListener('touchend', this.fingerUp)
      this.$refs.swipe.addEventListener('touchmove', this.fingerMove)
    }
  }
}
</script>
<style scoped lang="scss">
@media (max-width: $screen-sm-max) {
  .swipe-parent {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .swipe-container {
    width: 100%;
    height: 100%;
    position: absolute;
  }
}
</style>
