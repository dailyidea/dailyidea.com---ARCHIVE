<template>
  <div>
    <div
      class="light-box-bg"
      :class="{ 'light-box-expanded': isExpanded }"
    ></div>
    <layout :hide-mobile-nav="isExpanded" :hide-slide-menu="hideSlideMenu">
      <template v-slot:header>
        <categories-sub-header
          @category-clicked="handleCategoryClicked"
        ></categories-sub-header>
      </template>
      <swiper
        class="idea-card"
        :swipe-disabled="isExpanded"
        @swipe-start="setHideSlideMenuTrue"
        @swipe-end="setHideSlideMenuFalse"
        @swipe-left="nextIdea"
        @swipe-right="previousIdea"
        @left-arrow-clicked="previousIdea"
        @right-arrow-clicked="nextIdea"
        @animation-out-end="animationOutEnd"
      >
        <template v-slot:background>
          <idea-card-skeleton />
        </template>
        <template v-slot="{ rotationStyle }">
          <swipe-explainer
            v-if="showExplainer"
            class="card"
            :style="rotationStyle"
            :additional-styling="{ 'min-height': '71vh' }"
          ></swipe-explainer>
          <full-idea
            v-else
            ref="page"
            class="card"
            :idea="idea"
            :style="rotationStyle"
            :additional-styling="{ 'min-height': '71vh' }"
            @toggle-expand="isExpanded = !isExpanded"
          ></full-idea>
        </template>
      </swiper>
    </layout>
  </div>
</template>

<script>
import clip from 'text-clipper'
import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'
import Layout from '@/components/layout/Layout'
import FullIdea from '@/components/ideaDetail/FullIdea.vue'
import {
  getNewIdeas,
  getTopIdeas
} from '@/components/ideaDetail/ideaSwipeQueue.js'
import Swiper from '@/components/ideaDetail/Swiper'
import getIdea from '@/graphql/query/getIdea'
import incrementIdeaViews from '@/graphql/mutations/incrementIdeaViews'
import IdeaCardSkeleton from '@/components/ideaDetail/IdeaCardSkeleton'
import SwipeExplainer from '@/components/ideaDetail/SwipeExplainer'
import CategoriesSubHeader from '@/components/layout/CategoriesSubHeader'

export default {
  components: {
    Layout,
    Swiper,
    FullIdea,
    IdeaCardSkeleton,
    CategoriesSubHeader,
    SwipeExplainer
  },

  async asyncData({ app, route, redirect, error, res, store }) {
    try {
      const { data } = await app.$amplifyApi.graphql({
        query: getIdea,
        variables: { shortId: route.params.shortId },
        authMode: store.getters['userData/isAuthenticated']
          ? undefined
          : 'API_KEY'
      })
      const idea = data.getIdea

      // Redirect to correct slug if it doesn't match
      if (idea.slug !== route.params.slug) {
        return redirect(301, `/i/${idea.shortId}/${idea.slug}`)
      }

      return { idea, ideaQueue: [idea] }
    } catch (e) {
      error({ statusCode: 404, message: 'Idea not found' })
    }
  },

  data() {
    return {
      ideaIndex: 1,
      ideaQueue: [],
      nextToken: null,
      editMode: false,
      hideSlideMenu: false,
      idea: null,
      expandedState: false,
      showExplainer: false
    }
  },

  computed: {
    ...mapGetters({
      userId: 'userData/userId',
      isAuthenticated: 'userData/isAuthenticated'
    }),

    isExpanded: {
      set() {
        this.expandedState = !this.expandedState
      },
      get() {
        return this.expandedState === undefined ? false : this.expandedState
      }
    }
  },

  created() {
    this.showExplainer = !Cookies.get('hasSeenExplainer')
  },

  mounted() {
    this.cacheIdeas(this.getCategory())
    this.incrementViews()

    // Show success diaslog for jsut created idea
    if (this.idea && this.createdIdeaId === this.idea.ideaId) {
      this.showIdeaPostedDialog = true
      // this.updateCreatedIdea(null)
    }
  },

  methods: {
    getIdeasFunction(category) {
      switch (category) {
        case 'top':
          return getTopIdeas
        default:
          return getNewIdeas
      }
    },

    ideaSlug(newCategory) {
      let category = this.getCategory()

      if (newCategory) {
        category = newCategory
      }

      return `/i/${this.idea.shortId}/${this.idea.slug}?category=${category}`
    },

    getCategory() {
      let category = 'top'

      const queryCategory = this.$route.query.category
      if (queryCategory) {
        category = queryCategory
      }

      return category
    },

    nextIdea() {
      this.loadNewIdea(1)
    },
    previousIdea() {
      this.loadNewIdea(-1)
    },
    loadNewIdea(direction) {
      this.ideaIndex += direction

      if (this.ideaIndex >= this.ideaQueue.length || this.ideaIndex < 1) {
        this.ideaIndex -= direction
      }

      this.idea = this.ideaQueue[this.ideaIndex]
      if (this.ideaIndex > this.ideaQueue.length / 2) {
        this.cacheIdeas(this.getCategory())
      }
      this.updateIdeaSlug()
    },

    async handleCategoryClicked(category) {
      this.ideaQueue = []
      await this.cacheIdeas(category)
      this.ideaIndex = 1
      this.loadNewIdea(0)
      this.$router.push(`${this.ideaSlug(category)}`)
    },

    async incrementViews() {
      try {
        await this.$amplifyApi.graphql({
          query: incrementIdeaViews,
          variables: {
            ideaId: this.idea.ideaId,
            ideaOwnerId: this.$route.params.userId
          },
          authMode: 'API_KEY'
        })
      } catch (e) {
        this.$sentry.captureException(e)
      }
    },

    updateIdeaSlug() {
      window.history.pushState('', '', this.ideaSlug())
    },
    async cacheIdeas(category) {
      const ideasFunction = await this.getIdeasFunction(category)
      const ideas = await ideasFunction(this.$amplifyApi, this.nextToken)
      this.ideaQueue = Array.prototype.concat(this.ideaQueue, ideas.ideas)
      this.nextToken = ideas.nextToken
    },
    setHideSlideMenuTrue() {
      this.hideSlideMenu = true
    },
    setHideSlideMenuFalse() {
      this.hideSlideMenu = false
    },

    animationOutEnd() {
      this.showExplainer = false
      Cookies.set('hasSeenExplainer', 1, { expires: 365 })
    }
  },

  head() {
    const truncatedIdeaContent = clip(this.idea.content, 180, {
      html: true,
      maxLines: 8,
      indicator: '... (see more)'
    })
    const ogDescription = truncatedIdeaContent.replace(/<\/?[^>]+(>|$)/g, '')
    const attrs = {
      title: `${this.idea.title} - Daily Idea`,
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.idea.title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: ogDescription
        }
      ]
    }

    if (this.idea.previewImage) {
      attrs.meta.push({
        hid: 'og:image',
        property: 'og:image',
        content: `https://${process.env.USER_UPLOADS_S3_DOMAIN}.s3.amazonaws.com/${this.idea.previewImage}`
      })
    }

    return attrs
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/common.scss';

.idea-card {
  @media (max-width: $screen-sm-max) {
    position: absolute;
    width: 100%;
    z-index: 100;
  }

  .card {
    @media (min-width: $screen-md-min) {
      min-width: 70vw;
      max-width: 70vw;
    }
  }
}

.light-box-bg {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-color: $color-off-white;
}

.light-box-expanded {
  @media (max-width: $screen-sm-max) {
    position: fixed;
    background-color: $color-light-box;
    z-index: 1;
  }
}
</style>
