<template>
  <v-content>
    <welcome-desktop
      :params="params"
      @next="emitNext"
      @mark-as-welcomed="emitMarkAsWelcomed"
      @left-clicked="emitLeftClicked"
      @right-clicked="emitRightClicked"
      @go-to-one="emitGoToOne"
      @go-to-two="emitGoToTwo"
      @go-to-three="emitGoToThree"
    ></welcome-desktop>
    <welcome-mobile-portrait
      :params="params"
      hide-next-btn
      @mark-as-welcomed="emitMarkAsWelcomed"
      @right-clicked="emitRightClicked"
      @left-clicked="emitLeftClicked"
      @go-to-one="emitGoToOne"
      @go-to-two="emitGoToTwo"
      @go-to-three="emitGoToThree"
    ></welcome-mobile-portrait>
    <welcome-mobile-landscape
      :params="params"
      hide-next-btn
      @mark-as-welcomed="emitMarkAsWelcomed"
      @right-clicked="emitRightClicked"
      @left-clicked="emitLeftClicked"
      @go-to-one="emitGoToOne"
      @go-to-two="emitGoToTwo"
      @go-to-three="emitGoToThree"
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
    emitGoToOne() {
      this.$emit('go-to-one')
    },
    emitGoToTwo() {
      this.$emit('go-to-two')
    },
    emitGoToThree() {
      this.$emit('go-to-three')
    },
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
<style lang="scss" scoped></style>
