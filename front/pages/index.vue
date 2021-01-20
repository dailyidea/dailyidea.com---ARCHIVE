<template>
  <Layout>
    <swipe-explainer-bar
      v-if="page < slidesCount"
      :idea-index="page"
      :total="slidesCount"
    />
    <swiper
      v-slot="{ rotationStyle }"
      :allow-left="page > 0"
      :reverse-in-right="firstInStack"
      :animate-in="page < slidesCount"
      @swipe-start="setHideSlideMenuTrue"
      @swipe-end="setHideSlideMenuFalse"
      @swipe-left="nextIdea"
      @swipe-right="previousIdea"
      @left-arrow-clicked="previousIdea"
      @right-arrow-clicked="nextIdea"
      @animation-in-end="animationInEnd"
      @animation-out-end="animationOutEnd"
    >
      <swipable-card
        ref="page"
        :style="rotationStyle"
        class="overflow-y-auto"
        :padding-bottom="$vuetify.breakpoint.mdAndUp ? 40 : 0"
      >
        <div class="fill-height d-flex justify-center align-center">
          <pages :page="page" />
        </div>
      </swipable-card>
    </swiper>

    <div class="swipe-footer text-center pt-5 hidden-md-and-down">
      <slider-dots
        v-if="page < slidesCount"
        :step="page"
        :total="slidesCount"
      />
    </div>
  </Layout>
</template>

<script>
import Swiper from '@/components/ideaDetail/Swiper'
import SliderDots from '@/components/layout/svgIcons/SliderDots'
import Layout from '@/components/layout/Layout'
import SwipableCard from '@/components/shared/SwipableCard'
import SwipeExplainerBar from '@/components/home/SwipeExplainerBar'
import Pages from '@/components/home/Pages'

export default {
  components: {
    Pages,
    SwipableCard,
    SwipeExplainerBar,
    Layout,
    Swiper,
    SliderDots
  },

  data: () => ({
    mobileHeaderUiOptions: {
      pageTitle: '',
      leftButtonType: 'hamburder'
    },
    ideas: null,
    page: 0,
    hideSlideMenu: true,
    firstInStack: true,
    slidesCount: 4
  }),

  methods: {
    nextIdea() {
      this.loadNewIdea(1)
      this.firstInStack = this.page === 0
    },

    previousIdea() {
      this.loadNewIdea(-1)
    },

    loadNewIdea(direction) {
      const index = Math.max(this.page + direction, 0)
      if (index > this.slidesCount - 1) {
        this.$router.push('/ideas-cards')
      }
      this.page = index
    },

    setHideSlideMenuTrue() {
      this.hideSlideMenu = true
    },

    setHideSlideMenuFalse() {
      this.hideSlideMenu = false
    },

    animationInEnd() {
      this.firstInStack = this.page === 0
    },

    animationOutEnd() {
      if (this.firstInStack) {
        this.$notifier.error(
          "Oops, you're already at the beginning -- Please swipe the other way! :)"
        )
      }
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
  width: 100%;
}
.swipe-header {
  width: 100%;
}

#commonHeader {
  background-color: $color-off-white;
}
</style>
