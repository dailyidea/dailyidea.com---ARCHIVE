<template>
  <div
    ref="swipe-container"
    class="white-container d-flex flex-row align-center justify-space-between"
  >
    <div class="left">
      <header class="text-center py-2">
        <div class="title">{{ leftTitle }}</div>
        <div v-show="showDailyIdeaSubTitle" class="daily-idea">
          <span class="daily">DAILY</span><span class="idea">IDEA</span>
        </div>
      </header>
      <div class="bullet-points">
        <div
          v-for="(bullet, index) in bulletPoints"
          :key="index"
          class="bullet-point py-2"
        >
          <span class="bullet w-25"></span>
          <span class="text">{{ bullet }}</span>
        </div>
      </div>
      <footer class="d-flex flex-column text-center">
        <div v-show="!hideNextBtn">
          <v-btn class="my-2" @click="emitNext">Next</v-btn>
        </div>
        <div v-show="showBrowseIdeasBtn">
          <v-btn class="my-2" @click="emitMarkAsWelcomed">Browse Ideas</v-btn>
        </div>
        <div v-show="showWriteIdeasBtn">
          <v-btn class="my-2" @click="writeOwnIdea">Write my own idea</v-btn>
        </div>
        <div
          v-show="!hideExploreLink"
          class="explore-on-own"
          @click="emitMarkAsWelcomed"
        >
          I'll explore on my own
        </div>
        <div class="circles">
          <div class="d-flex flex-row justify-center mt-5">
            <div :class="one ? 'filled' : ''" class="circle mx-2"></div>
            <div :class="two ? 'filled' : ''" class="circle mx-2"></div>
            <div :class="three ? 'filled' : ''" class="circle mx-2"></div>
          </div>
        </div>
      </footer>
    </div>
    <div
      class="right yellow-bg text-center d-flex flex-column align-center justify-center pb-3"
    >
      <img :src="rightImage" />
      <div class="sub-image-text">{{ rightText }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'WelcomeMobileLandscape',
  props: {
    showDailyIdeaSubTitle: Boolean,
    showBrowseIdeasBtn: Boolean,
    showWriteIdeasBtn: Boolean,
    hideExploreLink: Boolean,
    hideNextBtn: Boolean,
    one: Boolean,
    two: Boolean,
    three: Boolean,
    rightImage: {
      type: String,
      required: true
    },
    rightText: {
      type: String,
      required: true
    },
    bulletPoints: {
      type: Array,
      required: true
    },
    leftTitle: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      touchStartPos: 0,
      touchEndPos: 0
    }
  },
  mounted() {
    this.setupSwipeEventListener()
  },
  methods: {
    emitNext() {
      this.$emit('next')
    },
    emitMarkAsWelcomed() {
      this.$emit('mark-as-welcomed')
    },
    writeOwnIdea() {
      this.$emit('mark-as-welcomed')
      window.location = '/ideas/me'
    },
    emitRightClicked() {
      this.$emit('right-clicked')
    },
    emitLeftClicked() {
      this.$emit('left-clicked')
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
      if (Math.abs(this.touchStartPos - this.touchEndPos) > 50) {
        if (this.touchStartPos < this.touchEndPos) {
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
  }
}
</script>
<style lang="scss" scoped>
.left {
  width: 100%;
}
.right {
  width: 100%;
}

.circles {
  position: absolute;
  margin: 0 auto;
  width: 100%;
  bottom: 5vh;
}

.circle {
  width: 15px;
  height: 15px;
  border: 1px solid gray;
  border-radius: 100%;
}

.filled {
  background-color: gray;
}

.white-container {
  height: 100vh;
  background-color: white;
}

.yellow-bg {
  background-color: $welcome-background-yellow;
  border-radius: 0 5px 5px 0;

  width: 100%;
  height: 100vh;
  img {
    width: 50%;
  }

  .sub-image-text {
    font-weight: bold;
    font-size: 1.2rem;
    width: 90%;
  }
}

.title {
  font-size: 1.4rem;
  font-weight: bold;
}

.bullet-point {
  position: relative;
  margin: 0 auto;
  width: 80%;

  text-align: left;
  display: flex;

  .bullet {
    display: inline-block;
    width: 19px;
    position: absolute;
    height: 19px;
    border-radius: 100%;
    border: 2px solid $color-muted-grey;
    margin-right: 1rem;
    margin-top: 0.25rem;
  }

  .text {
    font-size: 1rem;
    margin-left: 2rem;
  }
}

.daily {
  color: $primary-color;
  font-size: 1.3rem;
  font-weight: bold;
}

.idea {
  color: $secondary-color;
  font-size: 1.3rem;
  font-weight: bold;
}

.v-btn {
  color: black !important;
  width: 60%;
  height: 50px !important;
  font-size: 0.9rem;
}

.explore-on-own {
  text-decoration: underline;
  color: $primary-color;
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
}
</style>
