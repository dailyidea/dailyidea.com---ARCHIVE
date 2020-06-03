<template>
  <v-col ref="swipe-container">
    <span class="mobile text-center flex-column align-center">
      <div class="mobile-title">
        <slot name="mobile-header"></slot> 
      </div>
      <div class="right-column mt-10">
        <slot name="right"></slot>
      </div>
      <div class="left-column d-flex">
        <slot name="left"></slot>
      </div>
    </span>

    <v-card class="mx-auto">
      <v-row justify="center">
        <div @click="emitLeftClicked" class="arrow left-arrow" v-show="leftArrow">
          <v-icon>mdi-arrow-left</v-icon>
        </div>
        <div @click="emitRightClicked" class="arrow right-arrow" v-show="rightArrow">
          <v-icon>mdi-arrow-right</v-icon>
        </div>

        <v-col class="text-center left-column">
          <slot name="left"></slot>
        </v-col>
        <v-col class="text-center right-column">
          <slot name="right"></slot>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>
<script>
export default {
  name: 'WelcomeCard',
  props: {
    leftArrow: Boolean,
    rightArrow: Boolean,
  },
  data() {
    return {
      touchStartPos: 0,
      touchEndPos: 0
    }
  },
  methods: {
    emitLeftClicked() {
      this.$emit('left-clicked')
    },
    emitRightClicked() {
      this.$emit('right-clicked')
    },
    handleTouchStart(event) {
      const touch = event.touches[0].clientX
      this.touchStartPos = touch
    },
    handleTouchMove(event) {
      const touch = event.touches[0].clientX
      this.touchEndPos = touch
    },
    handleTouchEnd(event) {
      if(Math.abs(this.touchStartPos - this.touchEndPos) > 10) {
        if(this.touchStartPos < this.touchEndPos) {
          this.emitLeftClicked()
        } else {
          this.emitRightClicked()
        }
      }
    },
    setupSwipeEventListener() {
      const swipeContainer = this.$refs['swipe-container']
      swipeContainer.addEventListener('touchstart', this.handleTouchStart)
      swipeContainer.addEventListener('touchmove', this.handleTouchMove)
      swipeContainer.addEventListener('touchend', this.handleTouchEnd)
    }
  },
  mounted() {
    this.setupSwipeEventListener()
  }
}
</script>
<style lang="scss" scoped>
.mobile-title {
  display: none;
  @media only screen and (max-width: $screen-sm-max) {
    display: flex;
  }
}

.hidden-mobile {
  @media (max-width: $screen-sm-max) {
    display: none;
  }
}

.row { margin: 0; }

.right-column {
  background-color: $welcome-background-yellow;
  border-radius: 0 5px 5px 0;
  position: relative;
}

.left-column {
  margin-top: 2%;
  position: relative;
  height:100%;
}

.arrow {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: $welcome-arrow-background;
  border-radius: 100%;
  z-index: 200;
  top: 28vh;
  cursor: pointer;

  @media only screen and (max-width: $screen-sm-max) {
    display: none;
  }

  .v-icon { color: white; }

}

.arrow.left-arrow {
  left:-25px
}

.arrow.right-arrow {
  right: -25px;
}

.mobile {
  display: none;

  @media only screen and (max-width: $screen-sm-max) and (orientation:portrait) {
    display: flex;
  }

  width: 100vw;
  height: 100vh;
  background-color: white;
}

.v-card {
  @media only screen and (max-width: $screen-sm-max) {
    display: none;
  }
  
  @media only screen and (min-width: $screen-md-min) and (max-width: $screen-md-max) {
    width: 85vw;
  }

  @media only screen and (min-width: $screen-lg-min) {
    width: 80vw;
  }
}
</style>
