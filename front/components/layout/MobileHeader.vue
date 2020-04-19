<template>
  <v-app-bar flat color="white" class="mobileToolbar hidden-md-and-up">
    <!-- Hamburber or back button -->
    <v-container fluid style="padding: 0">
      <v-row>
        <template v-if="!searchIdeaMode">
          <v-col cols="2">
            <v-btn
              small
              icon
              style="vertical-align: top"
              @click="showSideMenu()"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="8" class="text-center">
            <nuxt-link
              class="logo"
              :to="{ name: 'ideas-me' }"
              style="text-decoration: none; vertical-align: top"
            >
              <img
                class="logo__icon"
                src="~/assets/images/logo_icon.svg"
              />
              <img
                class="logo__text"
                src="~/assets/images/logo_text.svg"
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
  display: inline-block;
  height: 28px;
  padding: 3px;

  img.logo__icon {
    height: 24px;
    margin-right: 6px;
    margin-bottom: -6px;
  }
  img.logo__text {
    height: 12px;
  }
}
</style>
