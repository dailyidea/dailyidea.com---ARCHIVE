<template>
  <v-content>
    <welcome-desktop
      :right-image="rightImage"
      :left-arrow="true"
      :hide-explore-link="true"
      :hide-next-btn="true"
      :right-text="rightText"
      :left-title="leftTitle"
      :bullet-points="bulletPoints"
      :show-browse-ideas-btn="true"
      :show-write-ideas-btn="true"
      @mark-as-welcomed="emitMarkAsWelcomed"
      @left-clicked="emitLeftClicked"
    ></welcome-desktop>
  </v-content>
</template>
<script>
import WelcomeDesktop from './WelcomeDesktop'
import rightImage from '~/assets/images/welcome/people-in-phones.png'

export default {
  name: 'WelcomeThird',
  components: { WelcomeDesktop },
  data() {
    return {
      rightImage,
      bulletPoints: [
        "We'll show you ideas similar to your own, so you can get inspired",
        'Discover the most popular ideas in your newsletter'
      ],
      leftTitle: 'Browse Other Ideas',
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
    emitLeftClicked() {
      this.$emit('left-clicked')
    }
  }
}
</script>
<style lang="scss" scoped></style>
