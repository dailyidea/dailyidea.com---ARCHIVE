<template>
  <div>
    <layout :hide-mobile-nav="!!expandedIdea" :hide-slide-menu="hideSlideMenu">
      <template v-slot:header>
        <categories-sub-header
          :category-selected="category"
          @category-clicked="updateCurrCategory"
        ></categories-sub-header>
      </template>
      <idea-card-skeleton />
      <swiper
        class="idea-card pointer-events-none"
        :swipe-disabled="!!expandedIdea"
        :hide-arrows="!!expandedIdea || !expandedIdeaTransitionEnd"
        :reverse-in-right="firstInStack"
        :reverse-in-left="lastInStack"
        @swipe-start="hideSlideMenu = true"
        @swipe-end="hideSlideMenu = false"
        @swipe-left="nextIdea"
        @swipe-right="previousIdea"
        @left-arrow-clicked="previousIdea"
        @right-arrow-clicked="nextIdea"
        @animation-in-end="animationInEnd"
        @swipe-parent-click="$refs.page.expandToggle()"
      >
        <template v-slot="{ rotationStyle }">
          <idea-swipable-card
            v-if="idea"
            ref="page"
            class="card"
            :idea="idea"
            :style="rotationStyle"
            close-btn
            :expanded="expandedIdea === idea"
            @updated="updateIdea"
            @deleted="deleteIdea"
            @expand="expandedIdea = idea"
            @collapse="expandedIdea = null"
            @comments-click="showCommnetsDialog = true"
            @expanded-transition-end="expandedIdeaTransitionEnd = true"
          ></idea-swipable-card>
        </template>
      </swiper>
    </layout>
    <share-idea-by-email
      v-model="showIdeaPostedDialog"
      :idea="idea"
      title="Idea Posted!"
      subtitle="Want to spark conversation and inspire others? Enter a friend’s email below."
      :image-path="require('~/assets/images/dialogs/dialog_idea_posted.svg')"
      dialog-height="480px"
    />
    <share-idea-by-email v-model="showShareDialog" :idea="idea" />
    <idea-comments-dialog v-model="showCommnetsDialog" :idea="idea" />
  </div>
</template>

<script>
import clip from 'text-clipper'
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import Layout from '@/components/layout/Layout'
import Swiper from '@/components/ideaDetail/Swiper'
import incrementIdeaViews from '@/graphql/mutations/incrementIdeaViews'
import IdeaCardSkeleton from '@/components/ideaDetail/IdeaCardSkeleton'
import CategoriesSubHeader from '@/components/layout/CategoriesSubHeader'
import IdeaSwipableCard from '@/components/ideaDetail/IdeaSwipableCard'
import ShareIdeaByEmail from '@/components/dialogs/ShareIdeaByEmail'
import { insertQueryParam, removeQueryParam } from '@/utils'
import IdeaCommentsDialog from '@/components/dialogs/IdeaCommentsDialog'

export default {
  components: {
    IdeaCommentsDialog,
    ShareIdeaByEmail,
    IdeaSwipableCard,
    Layout,
    Swiper,
    IdeaCardSkeleton,
    CategoriesSubHeader
  },

  async fetch({ app, route, store, redirect, error }) {
    const { shortId, slug } = route.params
    const queue = store.state.ideas.ideasQueues[store.state.ideas.currCategory]
    const ideaIdx = queue.ideas.findIndex(i => i.shortId === shortId)
    if (ideaIdx !== -1) {
      // We already have that idea loaded, just return to needed index
      return store.dispatch('ideas/updateIndex', { app, ideaIdx })
    }

    try {
      await store.dispatch('ideas/getIdea', { app, shortId })

      // Redirect to correct slug if it doesn't match
      const idea = store.getters['ideas/currIdea']
      if (idea.slug !== slug) {
        return redirect(301, `/i/${idea.shortId}/${idea.slug}`)
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Idea not found' })
    }
  },

  data() {
    return {
      hideSlideMenu: false,
      expandedIdea: null,
      expandedIdeaTransitionEnd: true,
      expandWithEdit: false,
      firstInStack: true,
      lastInStack: false,
      showIdeaPostedDialog: false,
      showShareDialog: false,
      showCommnetsDialog: false
    }
  },

  computed: {
    ...mapState({
      category: s => s.ideas.currCategory,
      createdIdeaId: s => s.ideas.createdIdeaId
    }),

    ...mapGetters({
      userId: 'userData/userId',
      isAuthenticated: 'userData/isAuthenticated',
      currIndex: 'ideas/currIndex',
      idea: 'ideas/currIdea',
      currIdeas: 'ideas/currIdeas'
    })
  },

  watch: {
    expandedIdea(idea) {
      if (idea) {
        insertQueryParam('full')
        this.expandedIdeaTransitionEnd = false
      } else {
        removeQueryParam('full')
      }
    },

    idea(val) {
      if (val && window.history.state.prev !== this.ideaUrl()) {
        window.history.pushState({ prev: this.ideaUrl() }, '', this.ideaUrl())
        this.$gtm.push({ event: 'pageview' })
      }
    },

    category() {
      if (!this.currIdeas.length) {
        this.getQueue({ app: this })
      }
    }
  },

  created() {
    this.updateCurrCategory(this.$route.query.category)
  },

  mounted() {
    // Show success dialog for jsut created idea
    if (this.idea && this.idea.ideaId === this.createdIdeaId) {
      this.showIdeaPostedDialog = true
      this.updateCreatedIdea(null)
    }
    this.incrementViews()
    this.getQueue({ app: this })
    this.firstInStack = this.currIndex === 0
    // Key only query string will be null, non existent is undefined, so null means key exists
    if (this.$route.query.full === null) {
      this.expandedIdea = this.idea
    }
    if (this.$route.query.aa === 'itc') {
      this.expandedIdea = this.idea
      this.showCommnetsDialog = true
    }
  },

  methods: {
    ...mapActions({
      getIdea: 'ideas/getIdea',
      getQueue: 'ideas/getQueue',
      updateIndex: 'ideas/updateIndex'
    }),

    ...mapMutations({
      updateCurrCategory: 'ideas/UPDATE_CURR_CATEGORY',
      updateIdea: 'ideas/UPDATE_IDEA',
      deleteIdea: 'ideas/DELETE_IDEA',
      updateCreatedIdea: 'ideas/UPDATE_CREATED'
    }),

    ideaUrl(newCategory) {
      const { shortId, slug } = this.idea
      return `/i/${shortId}/${slug}?category=${newCategory || this.category}`
    },

    async nextIdea() {
      if (this.lastInStack) {
        this.$notifier.error(
          "Oops, you've reached the end! Please swipe the other way!"
        )
      }
      await this.updateIndex({ app: this, direction: 1 })
    },

    async previousIdea() {
      if (this.firstInStack) {
        this.$notifier.error(
          "Oops, you're already at the beginning -- Please swipe the other way! :)"
        )
      }
      await this.updateIndex({ app: this, direction: -1 })
    },

    async incrementViews() {
      try {
        await this.$amplifyApi.graphql({
          query: incrementIdeaViews,
          variables: {
            ideaId: this.idea.ideaId,
            ideaOwnerId: this.idea.userId
          },
          authMode: 'API_KEY'
        })
      } catch (e) {
        this.$sentry.captureException(e)
      }
    },

    animationInEnd() {
      this.firstInStack = this.currIndex === 0
      this.lastInStack = this.currIndex === this.currIdeas.length - 1
    }
  },

  head() {
    if (!this.idea) {
      return {}
    }

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
