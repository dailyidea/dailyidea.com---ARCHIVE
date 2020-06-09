<template>
  <v-content>
    <welcome-desktop
      class="hidden-mobile"
      :params="params"
      hide-next-btn
      @mark-as-welcomed="emitMarkAsWelcomed"
      @left-clicked="emitLeftClicked"
    ></welcome-desktop>
    <welcome-mobile-portrait
      class="hidden-desktop hidden-landscape"
      hide-next-btn
      :params="params"
      @mark-as-welcomed="emitMarkAsWelcomed"
      @left-clicked="emitLeftClicked"
    ></welcome-mobile-portrait>
    <welcome-mobile-landscape
      class="hidden-desktop hidden-portrait"
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
<style lang="scss" scoped>
.hidden-mobile {
  display: none;
}

@media (orientation: landscape) {
  .hidden-landscape {
    display: none !important;
  }
}

@media (orientation: portrait) {
  .hidden-portrait {
    display: none !important;
  }
}

@media only screen and (min-width: $screen-md-min) {
  .hidden-desktop {
    display: none !important;
  }

  .hidden-mobile {
    display: flex;
  }
}
</style>
