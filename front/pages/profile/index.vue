<template>
  <users-profile
    :initial-profile-data="userInfo"
    :ideas="userIdeas"
    :load-more-ideas-is-possible="loadMoreIdeasIsPossible"
  ></users-profile>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import UsersProfile from '@/components/profilePage/UsersProfile'
import userInfoBySlug from '@/graphql/query/userInfoBySlug'
import getUsersIdeas from '@/graphql/query/getUsersIdeas'
import loadIdeas from '@/components/ideasList/loadIdeas'

export default {
  name: 'Index',
  middleware: 'authenticated',
  components: { UsersProfile },
  async asyncData({ app, route, store }) {
    const userSlug = store.getters['userData/slug']
    const userInfoRequest = app.$amplifyApi.graphql(
      graphqlOperation(userInfoBySlug, { slug: userSlug })
    )
    const userIdeasRequest = loadIdeas(
      app.$amplifyApi,
      'getUsersIdeas',
      getUsersIdeas,
      { authorSlug: userSlug, limit: 4 }
    )
    const [userInfoResponse, userIdeasResponse] = await Promise.all([
      userInfoRequest,
      userIdeasRequest
    ])
    const userInfo = userInfoResponse.data.userInfoBySlug.userInfo
    const userIdeas = userIdeasResponse.ideas
    const loadMoreIdeasIsPossible = !!userIdeasResponse.nextToken
    return {
      userInfo,
      userIdeas,
      loadMoreIdeasIsPossible
    }
  }
}
</script>

<style scoped></style>
