<template>
  <div>
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
              <v-icon @click="toggleSearchIdeaMode">fa-times</v-icon>
            </template>
            <template v-slot:prepend-inner>
              <v-icon size="22" @click="toggleSearchIdeaMode"
                >fa-search</v-icon
              >
            </template>
          </v-text-field>

          <!-- always visible search icon that toggles mode -->
          <v-btn
            v-else
            icon
            height="36"
            width="36"
            :input-value="searchIdeaMode"
            @click="toggleSearchIdeaMode"
          >
            <v-icon>fas fa-search</v-icon>
          </v-btn>
  </div>
</template>

<script>
export default {
  name: 'SearchComponent',
  props: {
    searchIdeaMode: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    }
  },
  methods: {
    toggleSearchIdeaMode() {
      this.$emit('onToggleSearchIdeaMode', !this.searchIdeaMode)
    }
  }

}
</script>
