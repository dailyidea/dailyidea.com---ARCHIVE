<template>
  <span>
    <ideas-list-page
      :initial-ideas="ideas"
      :initial-next-token="nextToken"
      :initial-order="order"
      title="ALL IDEAS"
      :end-point="endPoint"
      :end-point-name="endPointName"
      end-point-mode="API_KEY"
      show-author
    ></ideas-list-page>
  </span>
</template>
<script>
import ideasListPage from '@/components/ideasList/ideasListPage'
import loadIdeas from '@/components/ideasList/loadIdeas'
import { ORDER } from '@/components/ideasList/ideasOrdering'
import getPublicIdeas from '~/graphql/query/getPublicIdeas'
const DEFAULT_ORDER = ORDER.DATE_DESC
export default {
  components: {
    ideasListPage
  },
  async asyncData({ app, store, route }) {
    const order = route.query.order || DEFAULT_ORDER
    const data = await loadIdeas(
      app.$amplifyApi,
      'getPublicIdeas',
      getPublicIdeas,
      { order },
      'API_KEY'
    )
    data.order = order
    return data
  },
  data() {
    return {
      endPoint: getPublicIdeas,
      endPointName: 'getPublicIdeas'
    }
  },
  methods: {
    handleHideWelcomed() {
      this.$store.commit('userData/setUserWelcomed')
    }
  }
}
</script>
