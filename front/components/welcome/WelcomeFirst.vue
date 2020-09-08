<template>
  <v-content class="fill-height">
    <welcome-portrait :params="params"></welcome-portrait>
    <welcome-landscape :params="params"></welcome-landscape>
  </v-content>
</template>
<script>
import WelcomePortrait from './WelcomePortrait'
import WelcomeLandscape from './WelcomeLandscape'
import rightImage from '~/assets/images/welcome2/graphic1.svg'

export default {
  name: 'WelcomeFirst',
  components: {
    WelcomePortrait,
    WelcomeLandscape
  },
  data() {
    return {
      params: {
        title: 'Every Day, Log an Idea',
        subTitle: 'A project Idea, A startup idea, a work idea',
        subSubTitle: 'Practice generating ideas to become an idea machine',
        bulletPoints: null,
        footer: false,
        rightImage
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
