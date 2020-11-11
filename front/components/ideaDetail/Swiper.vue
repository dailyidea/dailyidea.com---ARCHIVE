<template>
  <div>
    <slot :is-swiping="swipeInProgress || !!xVal" name="background"></slot>
    <div
      v-if="allowLeft"
      class="left-arrow hidden-sm-and-down pointer-events-auto"
      @click="leftArrowClick"
    >
      <img src="~/assets/images/idea-card/left-arrow.png" />
    </div>
    <div
      v-if="allowRight"
      class="right-arrow hidden-sm-and-down pointer-events-auto"
      @click="rightArrowClick"
    >
      <img src="~/assets/images/idea-card/left-arrow.png" />
    </div>
    <div class="swipe-parent pointer-events-none">
      <div
        ref="swipe"
        :style="positionStyle"
        class="swipe-container pointer-events-auto"
      >
        <slot :rotation-style="rotationStyle"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    swipeDisabled: Boolean,
    allowLeft: { type: Boolean, default: true },
    allowRight: { type: Boolean, default: true },
    reverseInRight: { type: Boolean, default: false },
    reverseInLeft: { type: Boolean, default: false }
  },

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

    positionStyle() {
      return {
        transform: `translate3D(${this.xVal}px, ${this.yVal}px, 0px)`,
        transition: this.animate ? `${this.cardAnimationSpeed / 1000}s` : ''
      }
    },

    rotationStyle() {
      return {
        transform: `rotate(${this.rotationVal}deg)`,
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

      return { x, y }
    },

    setPos(event) {
      if (this.swipeDisabled) {
        return
      }

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
      this.xVal = x - this.xStart
      this.rotationVal = this.getRotation(x)
    },

    getRotation(x) {
      const rotation = (x - this.xStart) / 10
      this.yVal = Math.abs(rotation * 5)
      return rotation > 180 ? 180 : rotation
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
      return new Promise(resolve => {
        setTimeout(() => {
          method(args)
          resolve()
        }, this.cardAnimationSpeed)
      })
    },

    async resetSwipePosition() {
      this.enableAnimation()
      this.xVal = 0
      this.yVal = 0
      this.rotationVal = 0
      await this.queueNextAnimation(this.disableAnimation)
      this.enableSideScroll()
      this.$emit('animation-in-end')
    },

    setSwipeLeftCardPos(args) {
      // If we don't disable animation
      // Then the card will look like it's zooming
      // across the page

      this.disableAnimation()
      this.xVal = this.reverseInLeft ? -this.offPageWidth : this.offPageWidth
      if (!args.noRotation) {
        this.rotationVal = this.getRotation(this.xVal)
      }
      this.queueNextAnimation(this.resetSwipePosition)
      this.$emit('animation-out-end')
    },

    setSwipeRightCardPos(args) {
      this.disableAnimation()
      this.xVal = this.reverseInRight ? this.offPageWidth : -this.offPageWidth
      if (!args.noRotation) {
        this.rotationVal = this.getRotation(this.xVal)
      }
      this.queueNextAnimation(this.resetSwipePosition)
      this.$emit('animation-out-end')
    },

    fingerDown(event) {
      this.tapping = true
      const { x, y } = this.getPos(event)
      this.xStart = x
      this.yStart = y
      this.xCenter = event.srcElement.clientWidth / 2
      this.xDistanceToCenter = x - this.xCenter
      this.setPos(event)
    },

    fingerUp(event) {
      this.tapping = false
      this.endSwipe()
      if (this.xVal) {
        // Disable side scrolling otherwise swiping during the animation
        // will create weird behavior.
        this.disableSideScroll()
        this.enableAnimation()
        if (this.xVal > this.minSwipeDistanceBeforeAction) {
          this.xVal = this.offPageWidth
          this.rotationVal = this.getRotation(this.xVal)
          this.queueNextAnimation(this.setSwipeRightCardPos)
          if (this.allowLeft) {
            this.$emit('swipe-right')
          }
        } else if (this.xVal < -this.minSwipeDistanceBeforeAction) {
          this.xVal = -this.offPageWidthf
          this.rotationVal = this.getRotation(this.xVal)
          this.queueNextAnimation(this.setSwipeLeftCardPos)
          if (this.allowRight) {
            this.$emit('swipe-left')
          }
        } else {
          this.resetSwipePosition()
        }
      }
    },

    disableSideScroll() {
      document.querySelector('body').style.overflowX = 'hidden'
    },

    enableSideScroll() {
      document.querySelector('body').style.overflowX = ''
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
      this.xVal = this.offPageWidth
      this.queueNextAnimation(this.setSwipeRightCardPos, { noRotation: true })
      this.$emit('left-arrow-clicked')
    },

    rightArrowClick() {
      this.enableAnimation()
      this.xVal = -this.offPageWidth
      this.queueNextAnimation(this.setSwipeLeftCardPos, { noRotation: true })
      this.$emit('right-arrow-clicked')
    }
  }
}
</script>

<style scoped lang="scss">
@media (max-width: $screen-sm-max) {
  .swipe-parent,
  .swipe-container {
    height: 100%;
  }
}

.left-arrow {
  position: absolute;
  top: 30vh;
  left: 2vw;
  z-index: 1000;
  cursor: pointer;
  img {
    width: 50px;
  }
}

.right-arrow {
  position: absolute;
  top: 30vh;
  right: 2vw;
  z-index: 1000;
  cursor: pointer;
  transform: rotate(180deg);
  img {
    width: 50px;
  }
}
</style>
