<template>
  <div>
    <div
      class="light-box-bg"
      :class="{ 'light-box-expanded': isExpanded }"
      @click="$refs.page.expandToggle()"
    ></div>
    <layout :hide-mobile-nav="isExpanded" :hide-slide-menu="hideSlideMenu">
      <template v-slot:header>
        <categories-sub-header
          :category-selected="category"
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
          <idea-card-skeleton :additional-styling="{ 'min-height': '71vh' }" />
        </template>
        <template v-slot="{ rotationStyle }">
          <swipe-explainer
            v-if="showExplainer"
            class="card"
            :style="rotationStyle"
            :additional-styling="{ 'min-height': '71vh' }"
          ></swipe-explainer>
          <idea-card
            v-else
            ref="page"
            class="card"
            :idea="idea"
            :style="rotationStyle"
            :additional-styling="{ 'min-height': '71vh' }"
            @updated="i => (idea = i)"
            @expand-toggle="val => (isExpanded = val)"
          ></idea-card>
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
import IdeaCard from '@/components/ideaDetail/IdeaCard'

export default {
  components: {
    IdeaCard,
    Layout,
    Swiper,
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
      showExplainer: false,
      category: 'top',
      isExpanded: false
    }
  },

  computed: {
    ...mapGetters({
      userId: 'userData/userId',
      isAuthenticated: 'userData/isAuthenticated'
    })
  },

  mounted() {
    this.cacheIdeas(this.getCategoryFromURL())
    this.incrementViews()

    // Show success diaslog for jsut created idea
    if (this.idea && this.createdIdeaId === this.idea.ideaId) {
      this.showIdeaPostedDialog = true
      // this.updateCreatedIdea(null)
    }
    this.showExplainer = !Cookies.get('hasSeenExplainer')
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
      let category = this.category

      if (newCategory) {
        category = newCategory
      }

      return `/i/${this.idea.shortId}/${this.idea.slug}?category=${category}`
    },

    getCategoryFromURL() {
      let category = 'top'

      const queryCategory = this.$route.query.category
      if (queryCategory) {
        category = queryCategory
      }

      this.category = category

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

      if (this.ideaIndex >= this.ideaQueue.length || this.ideaIndex < 0) {
        this.ideaIndex -= direction
      }

      if (!this.ideaQueue[this.ideaIndex]) {
        return
      }

      this.idea = this.ideaQueue[this.ideaIndex]
      if (this.ideaIndex > this.ideaQueue.length / 2) {
        this.cacheIdeas(this.category)
      }
      this.updateIdeaSlug()
    },

    async handleCategoryClicked(category) {
      this.ideaIndex = 0
      this.category = category
      this.ideaQueue = []
      this.nextToken = null
      await this.cacheIdeas(category)
      this.idea = this.ideaQueue[this.ideaIndex]
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
      if (this.showExplainer) {
        Cookies.set('hasSeenExplainer', 1, { expires: 365 })
      }
      this.showExplainer = false
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
