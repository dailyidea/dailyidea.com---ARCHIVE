<template>
  <div id="errorPage">
    <PageNotFound
      v-if="error.statusCode === 404"
      ref="pageNotFound"
    ></PageNotFound>
    <h1 v-else>An error occurred</h1>
    <!-- <nuxt-link to="/">Home page</nuxt-link> -->
  </div>
</template>

<script>
import PageNotFound from '@/components/404'

export default {
  components: { PageNotFound },
  props: {
    error: { type: Object, required: true }
  },
  layout: 'blog' // you can set a custom layout for the error page
}
</script>

<style lang="scss">
@import '~assets/style/base';
@import '~assets/style/modals';
</style>
