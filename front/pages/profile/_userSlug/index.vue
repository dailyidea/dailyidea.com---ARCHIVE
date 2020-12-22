<template>
  <users-profile
    :initial-profile-data="userInfo"
    :ideas="userIdeas"
    :loading="loading"
    @idea-updated="updateIdeaLocal"
    @idea-deleted="deleteIdeaLocal"
  >
    <template v-slot:no-ideas>
      <no-ideas-placeholder
        title="Time to post your first idea!"
      ></no-ideas-placeholder>
    </template>
  </users-profile>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import userInfoBySlug from '@/graphql/query/userInfoBySlug'
import UsersProfile from '@/components/profilePage/UsersProfile'
import NoIdeasPlaceholder from '@/components/ideaDetail/NoIdeasPlaceholder'
import getUsersIdeas from '@/graphql/query/getUsersIdeas'
import loadIdeas from '@/helpers/load-ideas'
import getIdeas from '@/graphql/query/getIdeas'

// Ideas per page
const limit = 25

export default {
  components: { UsersProfile, NoIdeasPlaceholder },

  async asyncData({ app, route, store, error }) {
    const userSlug = route.params.userSlug
    const isMyProfile = store.getters['userData/slug'] === route.params.userSlug
    const userInfoRequest = await app.$amplifyApi.graphql({
      query: userInfoBySlug,
      variables: { slug: userSlug },
      authMode: isMyProfile ? undefined : 'API_KEY'
    })

    const userIdeasRequest = loadIdeas(
      app.$amplifyApi,
      isMyProfile ? 'ideas' : 'getUsersIdeas',
      isMyProfile ? getIdeas : getUsersIdeas,
      isMyProfile ? { limit } : { authorSlug: userSlug, limit },
      isMyProfile ? undefined : 'API_KEY'
    )
    const [userInfoResponse, userIdeasResponse] = await Promise.all([
      userInfoRequest,
      userIdeasRequest
    ])
    const userInfo = userInfoResponse.data.userInfoBySlug.userInfo
    if (!userInfo) {
      error({ statusCode: 404, message: 'User not found' })
    }

    return {
      userInfo,
      userIdeas: userIdeasResponse.ideas,
      nextToken: userIdeasResponse.nextToken
    }
  },

  data: () => ({
    userInfo: {},
    userIdeas: [],
    nextToken: null,
    loading: false
  }),

  computed: {
    ...mapGetters({
      userSlug: 'userData/slug'
    }),

    isMyProfile() {
      return this.$route.params.userSlug === this.userSlug
    }
  },

  mounted() {
    this.checkScrollBottom()
  },

  methods: {
    ...mapMutations({
      updateIdea: 'ideas/UPDATE_IDEA'
    }),

    updateIdeaLocal(idea) {
      const idx = this.userIdeas.findIndex(i => i.ideaId === idea.ideaId)
      const updatedIdea = Object.assign({}, this.userIdeas[idx], idea)
      if (idx !== -1) {
        this.$set(this.userIdeas, idx, updatedIdea)
      }
      this.updateIdea(updatedIdea)
    },

    deleteIdeaLocal(ideaId) {
      const idx = this.userIdeas.findIndex(i => i.ideaId === ideaId)
      if (idx !== -1) {
        this.userIdeas.splice(idx, 1)
      }
    },

    async loadNextIdeas() {
      if (this.loading || !this.nextToken) {
        return
      }
      this.loading = true

      const vars = { limit, nextToken: this.nextToken }
      if (!this.isMyProfile) {
        vars.authorSlug = this.$route.params.userSlug
      }

      const resp = await loadIdeas(
        this.$amplifyApi,
        this.isMyProfile ? 'ideas' : 'getUsersIdeas',
        this.isMyProfile ? getIdeas : getUsersIdeas,
        vars,
        this.isMyProfile ? undefined : 'API_KEY'
      )
      this.userIdeas = this.userIdeas.concat(resp.ideas)
      this.nextToken = resp.nextToken
      this.loading = false
    },

    checkScrollBottom() {
      window.onscroll = () => {
        const bottomOfWindow =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          ) +
            window.innerHeight ===
          document.documentElement.offsetHeight

        if (bottomOfWindow) {
          this.loadNextIdeas()
        }
      }
    }
  },

  head() {
    return {
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: `See ${this.userInfo.name}'s ideas on Daily Idea`
        }
      ]
    }
  }
}
</script>
