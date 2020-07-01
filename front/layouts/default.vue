<template>
  <v-app id="app">
    <!-- <Layout> -->
    <Nuxt />
    <!-- </Layout> -->
    <client-only>
      <div id="fb-root"></div>
      <div
        class="fb-customerchat"
        attribution="setup_tool"
        page_id="101648198154360"
        logged_in_greeting="Hi there! I'm Eric! If you have any feedback or questions, please chat me! :)"
        logged_out_greeting="Hi there! I'm Eric! If you have any feedback or questions, please chat me! :)"
      ></div>
    </client-only>
    <app-dialog />
  </v-app>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css'
import AppDialog from '@/components/dialogs/AppDialog'

export default {
  components: {
    AppDialog
  },

  mounted() {
    if (process.browser) {
      window.fbAsyncInit = function() {
        // eslint-disable-next-line
      FB.init({
          xfbml: true,
          version: 'v6.0'
        })
      }
      ;(function(d, s, id) {
        // eslint-disable-next-line
        const fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) {
          return
        }
        const js = d.createElement(s)
        js.id = id
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js'
        fjs.parentNode.insertBefore(js, fjs)
      })(document, 'script', 'facebook-jssdk')
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style/base';
</style>
