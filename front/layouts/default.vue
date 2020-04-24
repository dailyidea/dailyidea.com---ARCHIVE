<template>
  <v-app id="app">
    <!-- <Layout> -->
    <Nuxt />
    <!-- </Layout> -->
    <div id="fb-root"></div>
    <div
      class="fb-customerchat"
      attribution="setup_tool"
      page_id="101648198154360"
      logged_in_greeting="Hi there! I'm Eric! If you have any feedback or questions, please chat me! :)"
      logged_out_greeting="Hi there! I'm Eric! If you have any feedback or questions, please chat me! :)"
    ></div>
  </v-app>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css'

export default {
  components: {}
}
</script>

<style lang="scss">
@import '~assets/style/base';
</style>
