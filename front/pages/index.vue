<template>
  <Layout>
    <div class="swipe-header justify-center py-2 d-sm-flex ">
      <v-card
        class="d-flex justify-space-between pa-2 col-md-6 col-sm-12 swipe-header-card"
      >
        <div style="width: 50px;">&nbsp;</div>
        <div class="pt-3">
          <span v-if="ideaIndex === 0">
            <span v-if="$vuetify.breakpoint.smAndDown"
              >Swipe right to see the next idea</span
            >
            <span>Use arrow keys to see the next idea</span>
          </span>
          <span v-if="ideaIndex > 0">{{ ideaIndex + 1 }} of 3</span>
        </div>

        <div
          v-if="ideaIndex === 0"
          class="overflow-hidden"
          style="width: 40px; height: 45px; overflow: hidden;"
        >
          <img
            src="~assets/images/home/swipeicon-right.svg"
            alt="Swipe right"
            style="height: 68px; margin-top: -9px; margin-left: -15px;"
          />
        </div>
        <swipe-icon v-else class="swipe-header-icon" />
      </v-card>
    </div>

    <swiper
      v-slot="{ rotationStyle }"
      class="idea-card"
      :swipe-disabled="isExpanded"
      :allow-left="ideaIndex > 0"
      @swipe-start="setHideSlideMenuTrue"
      @swipe-end="setHideSlideMenuFalse"
      @swipe-left="nextIdea"
      @swipe-right="previousIdea"
      @left-arrow-clicked="previousIdea"
      @right-arrow-clicked="nextIdea"
    >
      <card
        ref="page"
        :style="rotationStyle"
        :additional-styling="{
          'max-height': isLandscape ? '' : 'calc(100vh - 80px - 70px - 20px)',
          'max-width': isMobile ? '' : '50vw'
        }"
      >
        <welcome :page-on="ideaIndex"></welcome>
      </card>
    </swiper>

    <div class="swipe-footer text-center py-5 hidden-md-and-down">
      <slider-dots v-if="ideaIndex < 3" :step="ideaIndex" />
    </div>
  </Layout>
</template>

<script>
import Card from '@/components/shared/Card'
import Swiper from '@/components/ideaDetail/Swiper'
import Welcome from '@/components/welcome/Welcome'
import SliderDots from '@/components/layout/svgIcons/SliderDots'
import SwipeIcon from '@/components/layout/svgIcons/SwipeIcon'
import Layout from '@/components/layout/Layout'
import getPublicIdeas from '~/graphql/query/getPublicIdeas'

export default {
  components: {
    Layout,
    Swiper,
    Card,
    Welcome,
    SliderDots,
    SwipeIcon
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
      let newIndex = this.ideaIndex + direction
      if (newIndex < 0) {
        newIndex = 0
      }
      if (newIndex > 2) {
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
