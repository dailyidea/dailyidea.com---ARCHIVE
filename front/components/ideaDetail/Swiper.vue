<template>
  <span>
    <div class="left-arrow hidden-sm-and-down" @click="leftArrowClick">
      <v-icon>mdi-arrow-left</v-icon>
    </div>
    <div class="right-arrow hidden-sm-and-down" @click="rightArrowClick">
      <v-icon>mdi-arrow-right</v-icon>
    </div>
    <div class="swipe-parent">
      <div ref="swipe" :style="position" class="swipe-container">
        <slot></slot>
      </div>
    </div>
  </span>
</template>
<script>
export default {
  name: 'Swiper',
  data() {
    return {
      tapping: false,
      swipeSensitivity: 35,
      xStart: 0,
      yStart: 0,
      xVal: 0,
      yVal: 0,
      xCenter: 0,
      xDistanceToCenter: 0,
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
      let x
      let y

      if (event.touches) {
        x = event.touches[0].clientX
        y = event.touches[0].clientY
      } else {
        x = event.clientX
        y = event.clientY
      }

      return {
        x,
        y
      }
    },
    setPos(event) {
      const { x } = this.getPos(event)
      if (Math.abs(this.xStart - x) < this.swipeSensitivity) return

      this.x = x - this.xCenter - this.xDistanceToCenter
      this.rotation = this.getRotation(x)
    },
    getRotation(x) {
      const rotation = (this.xStart - x) / 10
      this.y = Math.abs(rotation * 5)
      return rotation > 180 ? 180 : rotation
    },
    fingerDown(event) {
      this.tapping = true
      this.$emit('swipe-start')
      const { x, y } = this.getPos(event)
      this.xStart = x
      this.yStart = y
      this.xCenter = event.srcElement.clientWidth / 2
      this.xDistanceToCenter = x - this.xCenter
      this.setPos(event)
    },
    fingerUp(event) {
      this.tapping = false
      this.$emit('swipe-end')
      if (this.x > this.xStart + 100) {
        this.$emit('swipe-right')
      } else if (this.x < this.xStart - 100) {
        this.$emit('swipe-left')
      }

      this.x = 0
      this.y = 0
      this.rotation = 0
    },
    fingerMove(event) {
      if (!this.tapping) return
      this.setPos(event)
    },
    setupTouchListener() {
      window.addEventListener('touchmove', e => {
        e.preventDefault()
      })

      this.$refs.swipe.addEventListener('touchstart', this.fingerDown)
      this.$refs.swipe.addEventListener('touchend', this.fingerUp)
      this.$refs.swipe.addEventListener('touchmove', this.fingerMove)
    },
    leftArrowClick() {
      this.$emit('left-arrow-clicked')
    },
    rightArrowClick() {
      this.$emit('right-arrow-clicked')
    }
  }
}
</script>
<style scoped lang="scss">
.left-arrow {
  position: absolute;
  top: 40vh;
  left: -3vw;
  cursor: pointer;
}

.right-arrow {
  position: absolute;
  top: 40vh;
  right: -3vw;
  cursor: pointer;
}

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
