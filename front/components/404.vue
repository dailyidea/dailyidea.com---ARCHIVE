<template>
  <v-layout>
    <v-container>
      <v-row>
        <v-col cols="10" offset="1" md="8" offset-md="2">
          <v-img
            src="~/assets/images/undraw_page_not_found_su7k.svg"
            contain
            max-width="480"
            class="mx-auto"
          ></v-img>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="10" offset="1" md="8" offset-md="2" class="justify-center my-4">
          <h1 class="page-title">Page Not Found</h1>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="10" offset="1" md="8" offset-md="2" class="justify-center my-4 text-center">
          <p>Oops, sorry. We weren't able to find the page you are looking for.</p>
          <p>If you typed it in manually, please check the link and try again.</p>
          <p>Feel free to <a href="/ideas/all/">browse ideas on the site</a> or <a href="/">go to our home page</a>.</p>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
export default {
  components: {}
}
</script>
<style lang="scss">
@import "~assets/style/common";
</style>
