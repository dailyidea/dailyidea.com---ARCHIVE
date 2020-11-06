<template>
  <users-profile
    :initial-profile-data="userInfo"
    :ideas="userIdeas"
    :load-more-ideas-is-possible="loadMoreIdeasIsPossible"
    @idea-updated="(oldIdea, idea) => updateIdea(oldIdea, idea)"
  >
    <template v-slot:no-ideas>
      <no-ideas-placeholder
        title="Time to post your first idea!"
      ></no-ideas-placeholder>
    </template>
  </users-profile>
</template>

<script>
import userInfoBySlug from '@/graphql/query/userInfoBySlug'
import UsersProfile from '@/components/profilePage/UsersProfile'
import NoIdeasPlaceholder from '@/components/ideaDetail/NoIdeasPlaceholder'
import getUsersIdeas from '@/graphql/query/getUsersIdeas'
import loadIdeas from '@/components/ideasList/loadIdeas'
import getIdeas from '@/graphql/query/getIdeas'

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
      isMyProfile ? { limit: 25 } : { authorSlug: userSlug, limit: 25 },
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
    const userIdeas = userIdeasResponse.ideas
    const loadMoreIdeasIsPossible = !!userIdeasResponse.nextToken
    return {
      userInfo,
      userIdeas,
      loadMoreIdeasIsPossible
    }
  },

  methods: {
    updateIdea(oldIdea, idea) {
      const idx = this.userIdeas.findIndex(i => i.ideaId === idea.ideaId)
      this.$set(this.userIdeas, idx, idea)
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
