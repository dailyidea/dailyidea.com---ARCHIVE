<template>
  <div id="homePage">
    <div id="firstSection">
      <v-layout row wrap>
        <v-flex xs12>
          <v-card dark color="primary">
            <v-card-text class="px-0">12</v-card-text>
          </v-card>
        </v-flex>
        <v-flex v-for="i in 2" :key="`6${i}`" xs6>
          <v-card dark color="secondary">
            <v-card-text class="px-0">6</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
export default {
  fetch({ store, redirect }) {
    if (store.getters['cognito/isLoggedIn']) {
      redirect({ name: 'ideas' })
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('cognito/signOut')
    },

    login() {
      return true
    }
  }
}
</script>

<style lang="scss">
#homePage {
  background: red;

  #firstSection {
    background: red;
    width: 100%;
    height: 100vh;
  }
}
</style>
