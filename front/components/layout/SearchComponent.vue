<template>
  <div>
          <v-text-field
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
      this.$emit('onToggleSearchIdeaMode', false)
    }
  }

}
</script>
