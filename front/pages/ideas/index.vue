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
        <v-flex xs5>{{ idea.date | dayjs('format', 'YYYY-MM-DD') }}</v-flex>
        <v-flex xs7>
          <nuxt-link :to="{ name:'ideas-uid-ideadId', params: {uid:$route.params.uid, ideadId: idea.id} }">{{ idea.title }}</nuxt-link>
        </v-flex>
      </v-layout>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
export default {
  asyncData() {
    return {
      ideas: [
        { id: 1, title: 'idea 1', date: new Date('2017-12-12T03:24:00') },
        { id: 2, title: 'idea 2', date: new Date('2018-11-17T03:24:00') }
      ]
    }
  }
}
</script>
