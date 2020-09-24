<template>
  <Layout>
    <div class="swipe-header justify-center py-1 d-lg-none d-sm-flex ">
      <v-card
        class="d-flex justify-space-between pa-2 col-md-6 col-sm-12 swipe-header-card"
      >
        <exit-icon class="swipe-header-icon-close" />

        <span v-if="ideaIndex === 0" class="d-flex align-center"
          >Swipe right to see the next idea</span
        >
        <span v-if="ideaIndex === 1" class="d-flex align-center">1 of 3</span>
        <span v-if="ideaIndex === 2" class="d-flex align-center">2 of 3</span>
        <span v-if="ideaIndex === 3" class="d-flex align-center">3 of 3</span>

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
        :additional-styling="{
          'min-height': '60vh',
          'max-height': isLandscape ? '' : '60vh',
          'max-width': isMobile ? '' : '60vw'
        }"
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
      const newIndex = this.ideaIndex + direction
      if (newIndex < 0 || newIndex > 3) {
        const idea = this.ideas[0]
        if (idea) {
          this.$router.push(`/i/${idea.shortId}/${idea.slug}`)
        }
      } else {
        this.ideaIndex = newIndex
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
