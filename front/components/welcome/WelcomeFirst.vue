<template>
  <v-content>
    <welcome-desktop
      :right-image="rightImage"
      :right-arrow="true"
      :show-daily-idea-sub-title="true"
      :right-text="rightText"
      :left-title="leftTitle"
      :bullet-points="bulletPoints"
      @next="emitNext"
      @mark-as-welcomed="emitMarkAsWelcomed"
      @right-clicked="emitRightClicked"
    ></welcome-desktop>
  </v-content>
</template>
<script>
import WelcomeDesktop from './WelcomeDesktop'
import rightImage from '~/assets/images/welcome/person-in-window.png'

export default {
  name: 'WelcomeFirst',
  components: { WelcomeDesktop },
  data() {
    return {
      rightImage,
      bulletPoints: [
        'Store your ideas so you remember and improve them over time',
        "Browse other folks' ideas to inspire yourself further"
      ],
      leftTitle: 'Welcome to',
      rightText:
        'Everyday we will send you a simple reminder to come up with a new idea.'
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
