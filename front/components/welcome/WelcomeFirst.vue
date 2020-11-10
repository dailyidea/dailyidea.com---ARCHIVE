<template>
  <v-main class="fill-height">
    <welcome-content :params="params"></welcome-content>
  </v-main>
</template>
<script>
import WelcomeContent from './WelcomeContent'
import rightImage from '~/assets/images/welcome2/graphic1.svg'

export default {
  name: 'WelcomeFirst',
  components: {
    WelcomeContent
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
