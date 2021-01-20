<template>
  <div>
    <idea-lightbox
      v-if="idea"
      :value="!!expandedIdea && $vuetify.breakpoint.mdAndDown"
      :idea="expandedIdea"
      @input="expandedIdea = null"
      @updated="i => (idea = i)"
    />
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
        :reverse-in-right="firstInStack"
        :reverse-in-left="lastInStack"
        @swipe-start="hideSlideMenu = true"
        @swipe-end="hideSlideMenu = false"
        @swipe-left="nextIdea"
        @swipe-right="previousIdea"
        @left-arrow-clicked="previousIdea"
        @right-arrow-clicked="nextIdea"
        @animation-out-end="animationOutEnd"
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
            @updated="updateIdea"
            @deleted="deleteIdea"
            @expand="expandedIdea = idea"
          ></idea-swipable-card>
        </template>
      </swiper>
    </layout>
    <idea-posted-dialog
      v-model="showIdeaPostedDialog"
      @share="showShareDialog = true"
    />
    <share-idea-by-email v-model="showShareDialog" :idea="idea" />
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
import IdeaLightbox from '@/components/ideaDetail/IdeaLightbox'
import IdeaSwipableCard from '@/components/ideaDetail/IdeaSwipableCard'
import IdeaPostedDialog from '@/components/dialogs/IdeaPostedDialog'
import ShareIdeaByEmail from '@/components/dialogs/ShareIdeaByEmail'

export default {
  components: {
    ShareIdeaByEmail,
    IdeaPostedDialog,
    IdeaSwipableCard,
    IdeaLightbox,
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
      expandWithEdit: false,
      firstInStack: true,
      lastInStack: false,
      showIdeaPostedDialog: false,
      showShareDialog: false
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
    idea(val) {
      if (val && window.history.state.prev !== this.ideaUrl()) {
        window.history.pushState({ prev: this.ideaUrl() }, '', this.ideaUrl())
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
            ideaOwnerId: this.$route.params.userId
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
