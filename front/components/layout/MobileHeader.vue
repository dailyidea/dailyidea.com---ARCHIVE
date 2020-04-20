<template>
  <v-app-bar flat color="white" class="mobileToolbar hidden-md-and-up">
    <!-- Hamburber or back button -->
    <v-container fluid class="pl-0">
      <v-row>
        <template v-if="!searchIdeaMode">
          <v-col cols="2">
            <v-btn
              small
              icon
              @click="showSideMenu()"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="8" class="text-center">
            <nuxt-link
              class="logo"
              :to="{ name: 'ideas-me' }"
              style="text-decoration: none;"
            >
              <img
                class="logo"
                src="~/assets/images/logo_full.svg"
              />
            </nuxt-link>
          </v-col>
        </template>
        <v-col>
          <search-component
            :search-idea-mode="searchIdeaMode"
            :label="label"
            @onToggleSearchIdeaMode="onToggleSearchIdeaMode"
          ></search-component>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import SearchComponent from './SearchComponent'

export default {
  name: 'MobileHeader',
  components: {
    SearchComponent
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
.logo {
  height: 24px;
  vertical-align: middle;
}
</style>
