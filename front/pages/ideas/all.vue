<template>
  <ideas-list-page
    :initial-ideas="ideas"
    :initial-next-token="nextToken"
    title="ALL IDEAS"
    :end-point="endPoint"
    :end-point-name="endPointName"
    end-point-mode="API_KEY"
    show-author
  ></ideas-list-page>
</template>

<script>
import ideasListPage from '@/components/ideasList/ideasListPage'
import loadIdeas from '@/components/ideasList/loadIdeas'
import getPublicIdeas from '~/graphql/query/getPublicIdeas'

export default {
  components: { ideasListPage },
  asyncData({ app, store }) {
    return loadIdeas(
      app.$amplifyApi,
      'getPublicIdeas',
      getPublicIdeas,
      {},
      'API_KEY'
    )
  },
  data() {
    return {
      endPoint: getPublicIdeas,
      endPointName: 'getPublicIdeas'
    }
  }
}
</script>
