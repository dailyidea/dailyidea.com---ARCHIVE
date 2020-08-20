<template>
  <user-profile :initial-profile-data="initialProfileData" :ideas="ideas">
    <div v-if="ideas.length > 0" class="cards-container">
      <full-idea
        v-for="(idea, index) in ideas"
        :key="index"
        preview
        :idea="idea"
      ></full-idea>
    </div>
    <div v-else class="cards-container">
      <no-ideas-placeholder
        title="You haven't posted an idea yet."
        body="Browse ideas to get inspiration!"
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
import { ORDER } from '@/components/ideasList/ideasOrdering'
import getIdeas from '~/graphql/query/getIdeas'
const DEFAULT_ORDER = ORDER.DATE_DESC

export default {
  components: {
    UserProfile,
    FullIdea,
    NoIdeasPlaceholder
  },
  middleware: 'authenticated',
  async asyncData({ app, store, route }) {
    const order = route.query.order || DEFAULT_ORDER
    const data = await loadIdeas(app.$amplifyApi, 'ideas', getIdeas)
    data.order = order
    const userSlug = store.getters['userData/slug']
    const userInfoRequest = await app.$amplifyApi.graphql(
      graphqlOperation(userInfoBySlug, { slug: userSlug })
    )

    return {
      initialProfileData: userInfoRequest.data.userInfoBySlug.userInfo,
      ...data
    }
  },
  data() {
    return {
      endPoint: getIdeas,
      endPointName: 'ideas'
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
