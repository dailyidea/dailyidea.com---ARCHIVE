<template>
  <v-content>
    <welcome-desktop
      class="hidden-mobile"
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
    <welcome-mobile-portrait
      class="hidden-desktop hidden-landscape"
      :three="true"
      :two="true"
      :one="true"
      :right-image="rightImage"
      :right-text="rightText"
      :left-title="leftTitle"
      :bullet-points="bulletPoints"
      :hide-next-btn="true"
      :hide-explore-link="true"
      :show-browse-ideas-btn="true"
      :show-write-ideas-btn="true"
      @mark-as-welcomed="emitMarkAsWelcomed"
      @left-clicked="emitLeftClicked"
    ></welcome-mobile-portrait>
    <welcome-mobile-landscape
      class="hidden-desktop hidden-portrait"
      :one="true"
      :two="true"
      :three="true"
      :right-image="rightImage"
      :right-text="rightText"
      :left-title="leftTitle"
      :bullet-points="bulletPoints"
      :show-browse-ideas-btn="true"
      :show-write-ideas-btn="true"
      :hide-explore-link="true"
      :hide-next-btn="true"
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
