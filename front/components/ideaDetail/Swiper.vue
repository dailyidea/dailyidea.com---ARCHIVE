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
      swipeSensitivity: 20,
      minSwipeDistanceBeforeAction: 75,
      swipeInProgress: false,
      xStart: 0,
      yStart: 0,
      xVal: 0,
      yVal: 0,
      xCenter: 0,
      xDistanceToCenter: 0,
      rotationVal: 0,
      animate: false,
      cardAnimationSpeed: 200 // milliseconds
    }
  },
  computed: {
    offPageWidth() {
      const swipeContainerWidth = this.$refs.swipe.clientWidth

      return window.outerWidth + swipeContainerWidth
    },

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
        this.rotationVal = val
      },

      get() {
        return this.rotationVal
      }
    },

    positionStyle() {
      return {
        transform: `translate3D(${this.xVal}px, ${this.yVal}px, 0px)`,
        transition: this.animate ? `${this.cardAnimationSpeed / 1000}s` : ''
      }
    },

    rotationStyle() {
      return {
        transform: `rotate(${this.rotation}deg)`,
        transformOrigin: '50% 500px',
        transition: this.animate ? `${this.cardAnimationSpeed / 1000}s` : ''
      }
    }
  },
  mounted() {
    this.setupTouchListener()
    this.setupArrowKeyListener()
  },
  methods: {
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
      if (this.swipeInProgress === false) {
        // We haven't lifted the card yet
        if (Math.abs(this.xStart - x) < this.swipeSensitivity) {
          // AND the card hasn't traveled very car from it's original position
          // so do nothing
          return
        } else {
          // the card HAS traveled far enough now, so officially start the swipe
          this.startSwipe()
        }
      }

      event.preventDefault()
      this.x = x - this.xStart
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
    startSwipe() {
      this.$emit('swipe-start')
      this.swipeInProgress = true
    },
    endSwipe() {
      this.$emit('swipe-end')
      this.swipeInProgress = false
    },
    enableAnimation() {
      this.animate = true
    },
    disableAnimation() {
      this.animate = false
    },
    queueNextAnimation(method, args = {}) {
      setTimeout(() => {
        method(args)
      }, this.cardAnimationSpeed)
    },
    resetSwipePosition() {
      this.enableAnimation()
      this.x = 0
      this.y = 0
      this.rotation = 0
      this.queueNextAnimation(this.disableAnimation)
    },
    setSwipeLeftCardPos(args) {
      // If we don't disable animation
      // Then the card will look like it's zooming
      // across the page

      this.disableAnimation()
      this.x = this.offPageWidth
      if (!args.noRotation) {
        this.rotation = this.getRotation(this.x)
      }
      this.queueNextAnimation(this.resetSwipePosition)
    },
    setSwipeRightCardPos(args) {
      this.disableAnimation()
      this.x = -this.offPageWidth
      if (!args.noRotation) {
        this.rotation = this.getRotation(this.x)
      }
      this.queueNextAnimation(this.resetSwipePosition)
    },
    fingerDown(event) {
      this.disableScroll()
      this.tapping = true
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
      this.endSwipe()
      if (this.x) {
        this.enableAnimation()
        if (this.x > this.minSwipeDistanceBeforeAction) {
          this.x = this.offPageWidth
          this.rotation = this.getRotation(this.x)
          this.queueNextAnimation(this.setSwipeRightCardPos)
          this.$emit('swipe-right')
        } else if (this.x < -this.minSwipeDistanceBeforeAction) {
          this.x = -this.offPageWidth
          this.rotation = this.getRotation(this.x)
          this.queueNextAnimation(this.setSwipeLeftCardPos)
          this.$emit('swipe-left')
        } else {
          this.resetSwipePosition()
        }
      }
    },
    fingerMove(event) {
      if (!this.tapping) {
        this.fingerDown(event)
      } else {
        this.setPos(event)
      }
    },
    setupArrowKeyListener() {
      window.onkeydown = event => {
        if (event.key === 'ArrowLeft') {
          this.leftArrowClick()
        } else if (event.key === 'ArrowRight') {
          this.rightArrowClick()
        }
      }
    },
    setupTouchListener() {
      this.$refs.swipe.addEventListener('touchend', this.fingerUp)
      this.$refs.swipe.addEventListener('touchmove', this.fingerMove)
    },
    leftArrowClick() {
      this.enableAnimation()
      this.x = this.offPageWidth
      this.queueNextAnimation(this.setSwipeRightCardPos, {
        noRotation: true
      })
      this.$emit('left-arrow-clicked')
    },
    rightArrowClick() {
      this.enableAnimation()
      this.x = -this.offPageWidth
      this.queueNextAnimation(this.setSwipeLeftCardPos, {
        noRotation: true
      })
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
