<template>
  <user-profile :initial-profile-data="initialProfileData" :ideas="ideas">
    <div v-if="ideas.length > 0" class="cards-container">
      <full-idea
        v-for="(idea, index) in ideas"
        :key="index"
        preview
        allow-mobile-scroll
        :idea="idea"
      ></full-idea>
    </div>
    <div v-else class="cards-container">
      <no-ideas-placeholder
        title="Start saving inspiration"
        body="You don't have any saved ideas yet."
      ></no-ideas-placeholder>
    </div>
  </user-profile>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import userInfoBySlug from '@/graphql/query/userInfoBySlug'
import UserProfile from '@/components/profilePage/UsersProfile'
import FullIdea from '@/components/ideaDetail/FullIdea'
import NoIdeasPlaceholder from '@/components/ideaDetail/NoIdeasPlaceholder'

import loadIdeas from '@/components/ideasList/loadIdeas'
import getSavedIdeas from '~/graphql/query/getSavedIdeas'

export default {
  components: {
    UserProfile,
    FullIdea,
    NoIdeasPlaceholder
  },
  middleware: 'authenticated',
  async asyncData({ app, store }) {
    const userSlug = store.getters['userData/slug']
    const userInfoRequest = await app.$amplifyApi.graphql(
      graphqlOperation(userInfoBySlug, { slug: userSlug })
    )

    const ideas = await loadIdeas(
      app.$amplifyApi,
      'getSavedIdeas',
      getSavedIdeas
    )
    const initialProfileData = userInfoRequest.data.userInfoBySlug.userInfo

    return {
      initialProfileData,
      ideas: ideas.ideas
    }
  },
  data() {
    return {
      endPoint: getSavedIdeas,
      endPointName: 'getSavedIdeas'
    }
  }
}
</script>

<style scoped lang="scss">
.cards-container {
  margin: 0 auto;
  @media (min-width: $screen-md-min) {
    width: 33vw;
  }
}
</style>
