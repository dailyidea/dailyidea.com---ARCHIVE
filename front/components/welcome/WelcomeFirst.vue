<template>
  <v-content>
    <welcome-desktop
      :params="params"
      @next="emitNext"
      @mark-as-welcomed="emitMarkAsWelcomed"
      @right-clicked="emitRightClicked"
    ></welcome-desktop>
    <welcome-mobile-portrait
      :params="params"
      hide-next-btn
      @mark-as-welcomed="emitMarkAsWelcomed"
      @right-clicked="emitRightClicked"
    ></welcome-mobile-portrait>
    <welcome-mobile-landscape
      :params="params"
      hide-next-btn
      @mark-as-welcomed="emitMarkAsWelcomed"
      @right-clicked="emitRightClicked"
    ></welcome-mobile-landscape>
  </v-content>
</template>
<script>
import WelcomeDesktop from './WelcomeDesktop'
import WelcomeMobilePortrait from './WelcomeMobilePortrait'
import WelcomeMobileLandscape from './WelcomeMobileLandscape'
import rightImage from '~/assets/images/welcome/person-in-window.png'

export default {
  name: 'WelcomeFirst',
  components: {
    WelcomeDesktop,
    WelcomeMobilePortrait,
    WelcomeMobileLandscape
  },
  data() {
    return {
      params: {
        rightArrow: true,
        rightImage,
        one: true,
        showDailyIdeaSubTitle: true,
        bulletPoints: [
          'Store your ideas so you remember and improve them over time',
          "Browse other folks' ideas to inspire yourself further"
        ],
        leftTitle: 'Welcome to',
        rightText:
          'Everyday we will send you a simple reminder to come up with a new idea.'
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
    }
  }
}
</script>
<style lang="scss" scoped></style>
