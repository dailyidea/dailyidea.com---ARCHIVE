<template>
  <v-content class="fill-height">
    <welcome-portrait :params="params"></welcome-portrait>
    <welcome-landscape :params="params"></welcome-landscape>
  </v-content>
</template>
<script>
import WelcomePortrait from './WelcomePortrait'
import WelcomeLandscape from './WelcomeLandscape'
import rightImage from '~/assets/images/welcome2/no_account_graphic.svg'

export default {
  name: 'WelcomeFourth',
  components: {
    WelcomePortrait,
    WelcomeLandscape
  },
  data() {
    return {
      params: {
        title: null,
        subTitle: null,
        subSubTitle:
          "Oops, looks like you don't have an account yet! Lets help you out with that.",
        bulletPoints: null,
        footer: true,
        rightImage
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
