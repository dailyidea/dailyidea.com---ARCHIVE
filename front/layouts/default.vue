<template>
  <v-app id="app">
    <!-- <Layout> -->
    <Nuxt />
    <!-- </Layout> -->
    <app-dialog />
    <app-notifier />
  </v-app>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css'
import AppDialog from '@/components/dialogs/AppDialog'
import AppNotifier from '@/components/layout/AppNotifier'

export default {
  components: {
    AppDialog,
    AppNotifier
  }
}
</script>

<style lang="scss">
@import '~assets/style/base';
</style>
