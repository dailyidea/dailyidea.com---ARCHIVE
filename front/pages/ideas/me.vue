<template>
  <ideas-list-page
    :initial-ideas="ideas"
    :initial-next-token="nextToken"
    title="ALL IDEAS"
    :end-point="endPoint"
    :end-point-name="endPointName"
  ></ideas-list-page>
</template>

<script>
import getIdeas from '~/graphql/query/getIdeas'
import ideasListPage from '@/components/ideasList/ideasListPage'
import loadIdeas from '@/components/ideasList/loadIdeas'

export default {
  components: { ideasListPage },
  middleware: 'authenticated',
  asyncData({ app, store }) {
    return loadIdeas(app.$amplifyApi, 'ideas', getIdeas)
  },
  data() {
    return {
      endPoint: getIdeas,
      endPointName: 'ideas'
    }
  }
}
</script>
