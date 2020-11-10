<template>
  <ideas-list-page
    :initial-ideas="ideas"
    :initial-next-token="nextToken"
    title="IDEAS"
    :end-point="endPoint"
    :end-point-name="endPointName"
    :end-point-variables="{
      authorSlug: this.$router.currentRoute.params.userSlug
    }"
    end-point-mode="API_KEY"
  ></ideas-list-page>
</template>

<script>
import ideasListPage from '@/components/ideasList/ideasListPage'
import loadIdeas from '@/helpers/load-ideas'
import getUsersIdeas from '~/graphql/query/getUsersIdeas'

export default {
  components: { ideasListPage },
  asyncData({ app, store, route }) {
    return loadIdeas(
      app.$amplifyApi,
      'getUsersIdeas',
      getUsersIdeas,
      { authorSlug: route.params.userSlug },
      'API_KEY'
    )
  },
  data() {
    return {
      endPoint: getUsersIdeas,
      endPointName: 'getUsersIdeas'
    }
  }
}
</script>
