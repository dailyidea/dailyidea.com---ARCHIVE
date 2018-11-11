<template>
  <v-timeline dense clipped>
    <v-timeline-item
      v-for="idea in ideas"
      :key="idea.id"
      class="mb-3"
      color="grey"
      small
    >
      <v-layout justify-space-between>
        <v-flex xs5>{{ idea.ideaDate | dayjs('format', 'YYYY-MM-DD') }}</v-flex>
        <v-flex xs7>
          <nuxt-link :to="{ name:'ideas-ideadId', params: {ideadId: idea.ideaId} }">{{ idea.title }}
          </nuxt-link>
        </v-flex>
      </v-layout>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import getIdeas from '~/graphql/mutations/getIdeas'

export default {
  async asyncData({ app }) {
    const {
      data: { ideas }
    } = await app.$amplifyApi.graphql(graphqlOperation(getIdeas))
    return {
      ideas: ideas.items
    }
  }
}
</script>
