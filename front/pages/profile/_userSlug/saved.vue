<template>
  <user-profile :initial-profile-data="initialProfileData" :ideas="ideas">
    <template v-slot:no-ideas>
      <no-ideas-placeholder
        title="Start saving inspiration"
        body="You don't have any saved ideas yet."
      ></no-ideas-placeholder>
    </template>
  </user-profile>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import userInfoBySlug from '@/graphql/query/userInfoBySlug'
import UserProfile from '@/components/profilePage/UsersProfile'
import NoIdeasPlaceholder from '@/components/ideaDetail/NoIdeasPlaceholder'
import loadIdeas from '@/helpers/load-ideas'
import getSavedIdeas from '~/graphql/query/getSavedIdeas'

export default {
  components: {
    UserProfile,
    NoIdeasPlaceholder
  },

  middleware: 'authenticated',

  async asyncData({ app, store }) {
    const userSlug = await app.router.app._route.params.userSlug
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
