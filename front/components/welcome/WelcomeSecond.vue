<template>
  <v-content>
    <welcome-desktop
      class="hidden-mobile"
      :params="params"
      @next="emitNext"
      @mark-as-welcomed="emitMarkAsWelcomed"
      @left-clicked="emitLeftClicked"
      @right-clicked="emitRightClicked"
    ></welcome-desktop>
    <welcome-mobile-portrait
      class="hidden-desktop hidden-landscape"
      :params="params"
      :hide-next-btn="true"
      @mark-as-welcomed="emitMarkAsWelcomed"
      @right-clicked="emitRightClicked"
      @left-clicked="emitLeftClicked"
    ></welcome-mobile-portrait>
    <welcome-mobile-landscape
      class="hidden-desktop hidden-portrait"
      :params="params"
      :hide-next-btn="true"
      @mark-as-welcomed="emitMarkAsWelcomed"
      @right-clicked="emitRightClicked"
      @left-clicked="emitLeftClicked"
    ></welcome-mobile-landscape>
  </v-content>
</template>
<script>
import WelcomeDesktop from './WelcomeDesktop'
import WelcomeMobilePortrait from './WelcomeMobilePortrait'
import WelcomeMobileLandscape from './WelcomeMobileLandscape'
import rightImage from '~/assets/images/welcome/person-with-letter.png'

export default {
  name: 'WelcomeSecond',
  components: {
    WelcomeDesktop,
    WelcomeMobilePortrait,
    WelcomeMobileLandscape
  },
  data() {
    return {
      params: {
        rightArrow: true,
        leftArrow: true,
        one: true,
        two: true,
        rightImage,
        bulletPoints: [
          "Overflowing with ideas? Log them here. We'll remind you about your best ideas and show similar ideas that will spark your creativity.",
          "Only a few ideas? This will help you exercise your idea muscle. With practice you'll become an idea machine!"
        ],
        leftTitle: 'Save Your Ideas',
        rightText:
          "Just respond to the daily email and we'll automatically save your ideas for you."
      }
    }
  },
  methods: {
    emitNext() {
      this.$emit('next')
    },
    emitMarkAsWelcomed() {
      this.$emit('mark-as-welcomed')
    },
    emitRightClicked() {
      this.$emit('right-clicked')
    },
    emitLeftClicked() {
      this.$emit('left-clicked')
    }
  }
}
</script>
<style lang="scss" scoped>
.hidden-mobile {
  display: none;
}

@media (orientation: landscape) {
  .hidden-landscape {
    display: none !important;
  }
}

@media (orientation: portrait) {
  .hidden-portrait {
    display: none !important;
  }
}

@media only screen and (min-width: $screen-md-min) {
  .hidden-desktop {
    display: none !important;
  }

  .hidden-mobile {
    display: flex;
  }
}
</style>
