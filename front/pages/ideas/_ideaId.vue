<template>
  <v-container>
    <v-layout row>
      <v-flex>
        <p class="title">{{ idea.title }}</p>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex>
        <p>by <nuxt-link :to="{ name: 'ideas'}">{{ user.email }}</nuxt-link></p>
        <p class="idea-content">{{ idea.content }}</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import { graphqlOperation } from '@aws-amplify/api'
import getIdea from '~/graphql/mutations/getIdea'

export default {
  async asyncData({ app, route, store }) {
    const { data } = await app.$amplifyApi.graphql(
      graphqlOperation(getIdea, { ideaId: route.params.ideaId })
    )
    return {
      idea: data.getIdea,
      user: { email: store.state.cognito.user.attributes.email }
    }
  }
}
</script>
