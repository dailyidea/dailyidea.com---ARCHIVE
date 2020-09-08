<template>
  <div>
    <div
      class="light-box-bg"
      :class="{ 'light-box-expanded': isExpanded }"
    ></div>
    <layout :hide-mobile-nav="isExpanded" :hide-slide-menu="hideSlideMenu">
      <swiper
        class="idea-card"
        :swipe-disabled="isExpanded"
        @swipe-start="setHideSlideMenuTrue"
        @swipe-end="setHideSlideMenuFalse"
        @swipe-left="nextIdea"
        @swipe-right="previousIdea"
        @left-arrow-clicked="previousIdea"
        @right-arrow-clicked="nextIdea"
      >
        <template v-slot:background>
          <idea-card-skeleton />
        </template>
        <template v-slot="{ rotationStyle }">
          <full-idea
            ref="page"
            class="card"
            :idea="idea"
            :style="rotationStyle"
            @toggle-expand="isExpanded = !isExpanded"
          ></full-idea>
        </template>
      </swiper>
    </layout>
  </div>
</template>

<script>
import clip from 'text-clipper'
import { mapGetters } from 'vuex'
import Layout from '@/components/layout/Layout'
import FullIdea from '@/components/ideaDetail/FullIdea.vue'
import getAllIdeas from '@/components/ideaDetail/ideaSwipeQueue.js'
import Swiper from '@/components/ideaDetail/Swiper'
import getIdea from '@/graphql/query/getIdea'
import incrementIdeaViews from '@/graphql/mutations/incrementIdeaViews'
import IdeaCardSkeleton from '@/components/ideaDetail/IdeaCardSkeleton'

export default {
  components: {
    Layout,
    Swiper,
    FullIdea,
    IdeaCardSkeleton
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
      ideaIndex: 0,
      ideaQueue: [],
      nextToken: null,
      editMode: false,
      hideSlideMenu: false,
      idea: null,
      expandedState: false
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

  mounted() {
    this.cacheIdeas()
    this.incrementViews()

    // Show success diaslog for jsut created idea
    if (this.idea && this.createdIdeaId === this.idea.ideaId) {
      this.showIdeaPostedDialog = true
      // this.updateCreatedIdea(null)
    }
  },

  methods: {
    nextIdea() {
      this.loadNewIdea(1)
    },
    previousIdea() {
      this.loadNewIdea(-1)
    },
    loadNewIdea(direction) {
      this.ideaIndex += direction
      if (this.ideaIndex >= this.ideaQueue.length) {
        this.ideaIndex = 0
      } else if (this.ideaIndex < 0) {
        this.ideaIndex = this.ideaQueue.length - 1
      }

      this.idea = this.ideaQueue[this.ideaIndex]
      if (this.ideaIndex > this.ideaQueue.length / 2) {
        this.cacheIdeas()
      }
      this.updateIdeaSlug()
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
      window.history.pushState(
        '',
        '',
        `/i/${this.idea.shortId}/${this.idea.slug}`
      )
    },
    async cacheIdeas() {
      const ideas = await getAllIdeas(this.$amplifyApi, this.nextToken)
      this.ideaQueue = Array.prototype.concat(this.ideaQueue, ideas.ideas)
      this.nextToken = ideas.nextToken
    },
    setHideSlideMenuTrue() {
      this.hideSlideMenu = true
    },
    setHideSlideMenuFalse() {
      this.hideSlideMenu = false
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
