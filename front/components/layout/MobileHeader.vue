<template>
  <v-app-bar flat color="white" class="mobileToolbar hidden-md-and-up">
    <!-- Hamburber or back button -->

    <v-container fluid style="padding: 0">
      <v-row style="padding: 0 8px">
        <template v-if="!searchIdeaMode">
          <v-col style="padding: 0" cols="10">
            <v-btn
              small
              class="lightPinkButton"
              icon
              style="vertical-align: top"
              @click="showSideMenu()"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
            <nuxt-link
              class="logoLink"
              :to="{ name: 'ideas-me' }"
              style="text-decoration: none; vertical-align: top"
            >
              <img
                class="logoIcon"
                width="18"
                src="~/assets/images/logo_icon.png"
              />
              <img
                width="100"
                class="logoIcon logoText"
                src="~/assets/images/logo_text.png"
              />
            </nuxt-link>
          </v-col>
          <v-col style="padding: 0; text-align: right">
            <v-btn
              small
              icon
              style="vertical-align: top"
              @click="searchIdeaMode = true"
            >
              <v-icon size="18">fa-search</v-icon>
            </v-btn>
          </v-col>
        </template>
        <v-col v-else cols="12" style="padding: 0">
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
              <v-icon @click="searchIdeaMode = false">fa-times</v-icon>
            </template>
            <template v-slot:prepend-inner>
              <v-icon size="22" @click="searchIdeaMode = false"
                >fa-search</v-icon
              >
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: 'MobileHeader',
  data() {
    return {
      searchIdeaMode: false,
      label: ''
    }
  },
  methods: {
    showSideMenu() {
      this.$emit('showSideMenu')
    }
  }
}
</script>

<style scoped lang="scss">
.logoLink {
  display: inline-block;
  height: 28px;
  padding: 3px;
}
</style>
