<template>
  <v-content>
    <welcome-desktop
      :params="params"
      hide-next-btn
      @mark-as-welcomed="emitMarkAsWelcomed"
      @left-clicked="emitLeftClicked"
    ></welcome-desktop>
    <welcome-mobile-portrait
      hide-next-btn
      :params="params"
      @mark-as-welcomed="emitMarkAsWelcomed"
      @left-clicked="emitLeftClicked"
    ></welcome-mobile-portrait>
    <welcome-mobile-landscape
      :params="params"
      hide-next-btn
      @mark-as-welcomed="emitMarkAsWelcomed"
      @left-clicked="emitLeftClicked"
    ></welcome-mobile-landscape>
  </v-content>
</template>
<script>
import WelcomeDesktop from './WelcomeDesktop'
import WelcomeMobilePortrait from './WelcomeMobilePortrait'
import WelcomeMobileLandscape from './WelcomeMobileLandscape'
import rightImage from '~/assets/images/welcome/people-in-phones.png'

export default {
  name: 'WelcomeThird',
  components: {
    WelcomeDesktop,
    WelcomeMobilePortrait,
    WelcomeMobileLandscape
  },
  data() {
    return {
      params: {
        leftArrow: true,
        rightImage,
        one: true,
        two: true,
        three: true,
        hideExploreLink: true,
        showBrowseIdeasBtn: true,
        showWriteIdeasBtn: true,
        bulletPoints: [
          "We'll show you ideas similar to your own, so you can get inspired",
          'Discover the most popular ideas in your newsletter'
        ],
        leftTitle: 'Browse Other Ideas',
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
    emitLeftClicked() {
      this.$emit('left-clicked')
    }
  }
}
</script>
<style lang="scss" scoped></style>
