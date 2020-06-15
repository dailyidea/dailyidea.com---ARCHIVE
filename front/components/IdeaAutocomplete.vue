<template>
  <v-autocomplete
    v-model="select"
    :loading="loading"
    :items="items"
    :search-input.sync="search"
    cache-items
    class="mx-4"
    hide-no-data
    hide-details
    label="Find Idea by Short ID or Name"
    :item-text="itemText"
    item-value="ideaId"
  ></v-autocomplete>
</template>

<script>
import debounce from 'lodash/debounce'
import findIdeas from '@/graphql/query/findIdeas'

export default {
  data: () => ({
    loading: false,
    items: [],
    search: null,
    select: null
  }),

  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val)
    }
  },

  methods: {
    itemText(i) {
      return `(${i.shortId}) ${i.title}`
    },

    querySelections: debounce(async function(query) {
      if (query.length < 3) return
      this.loading = true

      try {
        const result = await this.$amplifyApi.graphql({
          query: findIdeas,
          variables: { query },
          authMode: 'API_KEY'
        })
        const { items } = result.data.findIdeas
        this.items = items
      } catch (e) {
        console.error(e)
      }

      this.loading = false
    }, 500)
  }
}
</script>
