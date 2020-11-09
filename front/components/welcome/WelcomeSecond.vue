<template>
  <v-content class="fill-height">
    <welcome-content :params="params"></welcome-content>
  </v-content>
</template>
<script>
import WelcomeContent from './WelcomeContent'
import rightImage from '~/assets/images/welcome2/graphic2.svg'

export default {
  name: 'WelcomeSecond',
  components: {
    WelcomeContent
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
