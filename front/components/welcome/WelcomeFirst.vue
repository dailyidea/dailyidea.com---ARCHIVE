<template>
  <v-content>
    <welcome-desktop
      class="hidden-mobile"
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
    <welcome-mobile-portrait
      class="hidden-desktop hidden-landscape"
      :one="true"
      :right-image="rightImage"
      :show-daily-idea-sub-title="true"
      :right-text="rightText"
      :left-title="leftTitle"
      :bullet-points="bulletPoints"
      :hide-next-btn="true"
      @mark-as-welcomed="emitMarkAsWelcomed"
      @right-clicked="emitRightClicked"
    ></welcome-mobile-portrait>
  </v-content>
</template>
<script>
import WelcomeDesktop from './WelcomeDesktop'
import WelcomeMobilePortrait from './WelcomeMobilePortrait'
import rightImage from '~/assets/images/welcome/person-in-window.png'

export default {
  name: 'WelcomeFirst',
  components: {
    WelcomeDesktop,
    WelcomeMobilePortrait
  },
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
