<template>
  <v-card height="60vh" width="80%" class="mx-auto my-auto">
    <v-row class="full-height">
      <div height="50vh" class="d-flex align-center">
        <div
          v-show="params.leftArrow"
          class="arrow left-arrow"
          @click="emitLeftClicked"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </div>
      </div>
      <div height="50vh" class="d-flex align-center">
        <div
          v-show="params.rightArrow"
          class="arrow right-arrow"
          @click="emitRightClicked"
        >
          <v-icon>mdi-arrow-right</v-icon>
        </div>
      </div>
      <v-col class="text-center d-flex flex-column justify-space-around">
        <header>
          <div class="left-title">{{ params.leftTitle }}</div>
          <div v-show="params.showDailyIdeaSubTitle" class="daily-idea">
            <span class="daily">DAILY</span><span class="idea">IDEA</span>
          </div>
        </header>
        <div class="bullet-points">
          <div
            v-for="(bullet, index) in params.bulletPoints"
            :key="index"
            class="bullet-point py-2"
          >
            <span class="bullet w-25"></span>
            <span class="text">{{ bullet }}</span>
          </div>
        </div>
        <footer class="d-flex flex-column">
          <div v-show="!hideNextBtn">
            <v-btn class="my-2" @click="emitNext">Next</v-btn>
          </div>
          <div v-show="params.showBrowseIdeasBtn">
            <v-btn class="my-2" @click="emitMarkAsWelcomed">Browse Ideas</v-btn>
          </div>
          <div v-show="params.showWriteIdeasBtn">
            <v-btn class="my-2" @click="writeOwnIdea">Write my own idea</v-btn>
          </div>
          <div
            v-show="!params.hideExploreLink"
            class="explore-on-own"
            @click="emitMarkAsWelcomed"
          >
            I'll explore on my own
          </div>
        </footer>
      </v-col>
      <v-col
        class="yellow-bg text-center d-flex flex-column justify-center align-center"
      >
        <img :src="params.rightImage" />
        <div class="sub-image-text">
          {{ params.rightText }}
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  name: 'WelcomeDesktop',
  props: {
    params: {
      type: Object,
      required: true
    },
    hideNextBtn: Boolean
  },
  methods: {
    emitMarkAsWelcomed() {
      this.$emit('mark-as-welcomed')
    },
    emitLeftClicked() {
      this.$emit('left-clicked')
    },
    emitRightClicked() {
      this.$emit('right-clicked')
    },
    emitNext() {
      this.$emit('next')
    },
    writeOwnIdea() {
      this.$emit('mark-as-welcomed')
      this.$router.push('/ideas/me')
    }
  }
}
</script>
<style lang="scss" scoped>
.row {
  margin: 0;
}
.full-height {
  height: 100%;
}

.v-btn {
  color: black !important;
  width: 40%;
  height: 50px !important;
  font-size: 0.9rem;
}

.left-title {
  font-size: 2rem;
  font-weight: bold;
}

.daily {
  color: $primary-color;
  font-size: 1.5rem;
  font-weight: bold;
}

.idea {
  color: $secondary-color;
  font-size: 1.5rem;
  font-weight: bold;
}

.explore-on-own {
  text-decoration: underline;
  color: $primary-color;
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
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
  cursor: pointer;

  .v-icon {
    color: white;
  }
}

.arrow.left-arrow {
  left: -25px;
}

.arrow.right-arrow {
  right: -25px;
}

.yellow-bg {
  background-color: $welcome-background-yellow;
  border-radius: 0 5px 5px 0;
  height: 100%;

  img {
    width: 50%;
  }

  .sub-image-text {
    font-weight: bold;
    font-size: 1.5rem;
    width: 80%;
  }
}

.bullet-point {
  position: relative;
  margin: 0 auto;
  width: 60%;

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
    font-size: 1.2rem;
    margin-left: 2rem;
  }
}
</style>
