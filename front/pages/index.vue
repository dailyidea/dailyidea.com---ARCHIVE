<template>
  <Layout>
    <swipe-explainer-bar :idea-index="ideaIndex" />
    <swiper
      v-slot="{ rotationStyle }"
      :swipe-disabled="isExpanded"
      :allow-left="ideaIndex > 0"
      @swipe-start="setHideSlideMenuTrue"
      @swipe-end="setHideSlideMenuFalse"
      @swipe-left="nextIdea"
      @swipe-right="previousIdea"
      @left-arrow-clicked="previousIdea"
      @right-arrow-clicked="nextIdea"
    >
      <swipable-card
        ref="page"
        :style="rotationStyle"
        top-padding-desktop="15rem"
        top-padding-mobile="11rem"
      >
        <welcome
          :page-on="ideaIndex"
          class="fill-height overflow-y-auto"
        ></welcome>
      </swipable-card>
    </swiper>

    <div class="swipe-footer text-center py-5 hidden-md-and-down">
      <slider-dots v-if="ideaIndex < 3" :step="ideaIndex" />
    </div>
  </Layout>
</template>

<script>
import Swiper from '@/components/ideaDetail/Swiper'
import Welcome from '@/components/welcome/Welcome'
import SliderDots from '@/components/layout/svgIcons/SliderDots'
import Layout from '@/components/layout/Layout'
import SwipableCard from '@/components/shared/SwipableCard'
import SwipeExplainerBar from '@/components/home/SwipeExplainerBar'

export default {
  components: {
    SwipableCard,
    SwipeExplainerBar,
    Layout,
    Swiper,
    Welcome,
    SliderDots
  },

  data: () => ({
    mobileHeaderUiOptions: {
      pageTitle: '',
      leftButtonType: 'hamburder'
    },
    ideas: null,
    ideaIndex: 0,
    isLandscape: false,
    hideSlideMenu: true
  }),

  computed: {
    isExpanded: {
      set() {
        this.expandedState = !this.expandedState
      },
      get() {
        return this.expandedState === undefined ? false : this.expandedState
      }
    }
  },

  mounted() {
    this.isLandscape = window.innerWidth > window.innerHeight
    window.addEventListener('resize', event => {
      this.isLandscape = window.innerWidth > window.innerHeight
    })
  },

  methods: {
    nextIdea() {
      this.loadNewIdea(1)
    },

    previousIdea() {
      this.loadNewIdea(-1)
    },

    loadNewIdea(direction) {
      const index = Math.max(this.ideaIndex + direction, 0)
      if (index > 2) {
        this.$router.push('/ideas-cards')
      } else {
        this.ideaIndex = index
      }
    },

    setHideSlideMenuTrue() {
      this.hideSlideMenu = true
    },

    setHideSlideMenuFalse() {
      this.hideSlideMenu = false
    }
  }
}
</script>

<style lang="scss" scoped>
.swipe-header-card {
  border-radius: 10px !important;
}

.swipe-header-icon-close {
  align-self: center;
}

.swipe-header-icon {
  height: 45px;
  width: 50px;
}

.swipe-footer {
  height: 100px;
  width: 100%;
}
.swipe-header {
  width: 100%;
}

#commonHeader {
  background-color: $color-off-white;
}
</style>
