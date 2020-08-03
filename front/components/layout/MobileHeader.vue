<template>
  <v-app-bar flat color="white" class="hidden-md-and-up mobile-toolbar">
    <!-- Hamburber or back button -->
    <v-container fluid>
      <links></links>
    </v-container>
  </v-app-bar>
</template>

<script>
import Links from './Links'

export default {
  name: 'MobileHeader',
  components: {
    Links
  },
  data() {
    return {
      searchIdeaMode: false,
      label: ''
    }
  },
  methods: {
    showSideMenu() {
      this.$emit('showSideMenu')
    },
    onToggleSearchIdeaMode(value) {
      this.searchIdeaMode = value
    }
  }
}
</script>

<style scoped lang="scss">
.mobile-toolbar {
  border-top: 2px solid $secondary-color;
}
</style>
