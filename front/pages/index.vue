<template>
  <Layout>
    <div class="swipe-header justify-center py-5 d-lg-none d-sm-flex ">
      <v-card
        class="d-flex justify-space-between pa-2 col-md-6 col-sm-12 swipe-header-card"
      >
        <exit-icon class="swipe-header-icon-close" />

        <span v-if="ideaIndex === 0" class="d-flex align-center"
          >Swipe right to see the next idea</span
        >
        <span v-if="ideaIndex === 1" class="d-flex align-center">2 of 3</span>
        <span v-if="ideaIndex === 2" class="d-flex align-center">3 of 3</span>

        <swipe-icon class="swipe-header-icon" />
      </v-card>
    </div>

    <swiper
      v-slot="{ rotationStyle }"
      class="idea-card"
      :swipe-disabled="isExpanded"
      @swipe-start="setHideSlideMenuTrue"
      @swipe-end="setHideSlideMenuFalse"
      @swipe-left="nextIdea"
      @swipe-right="previousIdea"
      @left-arrow-clicked="previousIdea"
      @right-arrow-clicked="nextIdea"
    >
      <idea-card
        ref="page"
        :style="rotationStyle"
        @expand-toggle="isExpanded = !isExpanded"
      >
        <Welcome :page-on="ideaIndex"></Welcome>
      </idea-card>
    </swiper>

    <div class="swipe-footer text-center py-5 hidden-md-and-down">
      <slider-dots v-if="ideaIndex < 3" :step="ideaIndex" />
    </div>
  </Layout>
</template>

<script>
import IdeaCard from '@/components/ideaDetail/IdeaCard'
import Swiper from '@/components/ideaDetail/Swiper'
import Welcome from '@/components/welcome/Welcome'
import SliderDots from '@/components/layout/svgIcons/SliderDots'
import ExitIcon from '@/components/layout/svgIcons/ExitIcon'
import SwipeIcon from '@/components/layout/svgIcons/SwipeIcon'
import Layout from '@/components/layout/Layout'
import getPublicIdeas from '~/graphql/query/getPublicIdeas'

export default {
  components: {
    Layout,
    Swiper,
    IdeaCard,
    Welcome,
    SliderDots,
    SwipeIcon,
    ExitIcon
  },
  async asyncData({ app }) {
    let result = await app.$amplifyApi.graphql({
      query: getPublicIdeas,
      variables: {
        nextToken: null,
        limit: 3
      },
      authMode: 'API_KEY'
    })

    result = result.data.getPublicIdeas
    return {
      ideas: result.items
    }
  },
  data: () => ({
    mobileHeaderUiOptions: {
      pageTitle: '',
      leftButtonType: 'hamburder'
    },
    ideas: null,
    ideaIndex: 0,
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

  created() {},
  methods: {
    nextIdea() {
      this.loadNewIdea(1)
    },
    previousIdea() {
      this.loadNewIdea(-1)
    },
    loadNewIdea(direction) {
      if (this.ideaIndex > 3) {
        return
      }
      this.ideaIndex += direction
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
  height: 100px;
  width: 100%;
}

#commonHeader {
  background-color: $color-off-white;
}
</style>
