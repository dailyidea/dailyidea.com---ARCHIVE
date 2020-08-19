<template>
  <v-content class="fill-height">
    <welcome-portrait :params="params"></welcome-portrait>
    <welcome-landscape :params="params"></welcome-landscape>
  </v-content>
</template>
<script>
import WelcomePortrait from './WelcomePortrait'
import WelcomeLandscape from './WelcomeLandscape'
import rightImage from '~/assets/images/welcome2/graphic2.svg'

export default {
  name: 'WelcomeSecond',
  components: {
    WelcomePortrait,
    WelcomeLandscape
  },
  data() {
    return {
      params: {
        title: 'Browse Popular Ideas',
        subTitle: 'Explore other ideas to inspire your own creativity',
        subSubTitle: null,
        bulletPoints: null,
        footer: false,
        rightImage
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
