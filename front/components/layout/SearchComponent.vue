<template>
  <div v-if="false">
    <!-- removing the search bar entirely for now since we don't have the functionality -->
    <div class="text-right">
      <!-- when search mode is on, show text input field -->
      <v-text-field
        v-if="searchIdeaMode"
        v-model="label"
        label="What are you looking for?"
        solo
        dense
        autofocus
        hide-details
      >
        <template v-slot:append>
          <v-icon small @click="toggleSearchIdeaMode">fa-times</v-icon>
        </template>
        <template v-slot:prepend-inner>
          <v-icon small @click="toggleSearchIdeaMode">fa-search</v-icon>
        </template>
      </v-text-field>

      <!-- otherwise the search icon that toggles mode -->
      <v-btn
        v-else
        icon
        :input-value="searchIdeaMode"
        @click="toggleSearchIdeaMode"
      >
        <v-icon small>fas fa-search</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchComponent',
  props: {
    searchIdeaMode: { type: Boolean, default: false },
    label: { type: String, default: '' }
  },
  methods: {
    toggleSearchIdeaMode() {
      this.$emit('onToggleSearchIdeaMode', !this.searchIdeaMode)
    }
  }
}
</script>
