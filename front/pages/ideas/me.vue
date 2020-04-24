<template>
  <ideas-list-page
    :initial-ideas="ideas"
    :initial-next-token="nextToken"
    :initial-order="order"
    title="MY IDEAS"
    :end-point="endPoint"
    :end-point-name="endPointName"
  ></ideas-list-page>
</template>

<script>
import ideasListPage from '@/components/ideasList/ideasListPage'
import loadIdeas from '@/components/ideasList/loadIdeas'
import getIdeas from '~/graphql/query/getIdeas'
import { ORDER } from '@/components/ideasList/ideasOrdering'
const DEFAULT_ORDER = ORDER.DATE_DESC

export default {
  components: { ideasListPage },
  middleware: 'authenticated',
  async asyncData({ app, store, route }) {
    const order = route.query.order || DEFAULT_ORDER
    const data = await loadIdeas(app.$amplifyApi, 'ideas', getIdeas)
    data.order = order
    return data
  },
  data() {
    return {
      endPoint: getIdeas,
      endPointName: 'ideas'
    }
  }
}
</script>
