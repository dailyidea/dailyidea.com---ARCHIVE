<template>
  <static-page>
    <p class="title">Create Digest Mailing</p>

    <v-row>
      <v-col cols="6">
        <idea-autocomplete v-model="idea" />
      </v-col>
    </v-row>
  </static-page>
</template>

<script>
import StaticPage from '@/components/layout/StaticPage'
import IdeaAutocomplete from '@/components/IdeaAutocomplete'

export default {
  components: {
    IdeaAutocomplete,
    StaticPage
  },

  data: () => ({
    idea: null
  })
}
</script>
