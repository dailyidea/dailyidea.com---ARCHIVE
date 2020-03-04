<template>
  <ideas-list-page
    :initial-ideas="ideas"
    :initial-next-token="nextToken"
    title="MY IDEAS"
    :end-point="endPoint"
    :end-point-name="endPointName"
  ></ideas-list-page>
</template>

<script>
import ideasListPage from '@/components/ideasList/ideasListPage'
import loadIdeas from '@/components/ideasList/loadIdeas'
import getIdeas from '~/graphql/query/getIdeas'

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
