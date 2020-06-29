<template>
  <span>
    <div class="left-arrow hidden-sm-and-down" @click="leftArrowClick">
      <v-icon>mdi-arrow-left</v-icon>
    </div>
    <div class="right-arrow hidden-sm-and-down" @click="rightArrowClick">
      <v-icon>mdi-arrow-right</v-icon>
    </div>
    <div class="swipe-parent">
      <div ref="swipe" :style="positionStyle" class="swipe-container">
        <slot :rotation-style="rotationStyle"></slot>
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
      swipeSensitivity: 50,
      minSwipeDistanceBeforeAction: 75,
      xStart: 0,
      yStart: 0,
      xVal: 0,
      yVal: 0,
      xCenter: 0,
      xDistanceToCenter: 0,
      rotationVal: 0,
      rotationStyle: {
        transform: '',
        transformOrigin: '50% 500px'
      }
    }
  },
  computed: {
    x: {
      set(val) {
        this.xVal = val
      },

      get() {
        return this.xVal
      }
    },

    y: {
      set(val) {
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
    },

    positionStyle() {
      return {
        transform: `translate3D(${this.xVal}px, ${this.yVal}px, 0px)`
      }
    }
  },
  mounted() {
    this.setupTouchListener()
  },
  methods: {
    setRotation(val) {
      this.rotationStyle.transform = `rotate(${val}deg)`
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

      event.preventDefault()
      this.x = x - this.xCenter - this.xDistanceToCenter
      this.rotation = this.getRotation(x)
    },
    getRotation(x) {
      const rotation = (x - this.xStart) / 10
      this.y = Math.abs(rotation * 5)
      return rotation > 180 ? 180 : rotation
    },
    disableScroll() {
      document.querySelector('body').style.overflow = 'hidden'
    },
    enableScroll() {
      document.querySelector('body').style.overflow = ''
    },
    fingerDown(event) {
      this.disableScroll()
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
      this.enableScroll()
      this.tapping = false
      this.$emit('swipe-end')
      if (this.x) {
        if (this.x > this.xStart + this.minSwipeDistanceBeforeAction) {
          this.$emit('swipe-right')
        } else if (this.x < this.xStart - this.minSwipeDistanceBeforeAction) {
          this.$emit('swipe-left')
        }
      }
      this.x = 0
      this.y = 0
      this.rotation = 0
    },
    fingerMove(event) {
      if (!this.tapping) {
        this.fingerDown(event)
      } else {
        this.setPos(event)
      }
    },
    setupTouchListener() {
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

.swipe-parent {
  width: 100%;
  height: 100%;
}

.swipe-container {
  width: 100%;
  height: 100%;
}
</style>
