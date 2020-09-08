<template>
  <v-content class="fill-height">
    <welcome-portrait :params="params"></welcome-portrait>
    <welcome-landscape :params="params"></welcome-landscape>
  </v-content>
</template>
<script>
import WelcomePortrait from './WelcomePortrait'
import WelcomeLandscape from './WelcomeLandscape'
import rightImage from '~/assets/images/welcome2/graphic3.svg'
import sendImage from '~/assets/images/welcome2/send.svg'
import mailImage from '~/assets/images/welcome2/mail.svg'

export default {
  name: 'WelcomeThird',
  components: {
    WelcomePortrait,
    WelcomeLandscape
  },
  data() {
    return {
      params: {
        title: 'How Does it Work?',
        subTitle: null,
        subSubTitle: null,
        bulletPoints: [
          {
            icon: mailImage,
            text: "We'll send you an email to remind you to submit an idea."
          },
          {
            icon: sendImage,
            text:
              'You just respond to the email with an idea and we store if for you.'
          }
        ],
        footer: false,
        rightImage
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
