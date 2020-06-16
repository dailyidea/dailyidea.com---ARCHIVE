<template>
  <div>
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
      :return-object="true"
      :error-messages="errorMessage"
      :error-count="1"
      @change="v => $emit('change', v)"
    ></v-autocomplete>
    <span v-if="errorMessage" class="mx-4 text-body-2 error--text">{{
      errorMessage
    }}</span>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import findIdeas from '@/graphql/query/findIdeas'

export default {
  props: {
    errorMessage: String
  },

  data: () => ({
    loading: false,
    items: [],
    search: null,
    select: null
  }),

  watch: {
    search(val) {
      if (!this.select) {
        return this.querySelections(val)
      }

      if (val && this.getIdFromLabel(val) !== this.select.shortId) {
        return this.querySelections(val)
      }
    }
  },

  methods: {
    itemText(i) {
      return `(${i.shortId}) ${i.title}`
    },

    getIdFromLabel(label) {
      const hasId = label.match(/\(([a-z0-9]{6})\)/)
      if (hasId) {
        return hasId[1]
      }
      return ''
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
