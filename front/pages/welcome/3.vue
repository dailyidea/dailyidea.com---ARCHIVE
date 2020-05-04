<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="page-title">
          Browsing Other Ideas
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <p>
          Inspire your own creativity by seeing what other people are thinking
          of.
        </p>
        <p>
          We'll show you ideas that are similar to your own, so that you can get
          inspired and add on to your own ideas.
        </p>
        <p>
          Discover the most popular ideas in our newsletter.
        </p>
      </v-col>
    </v-row>

    <v-row class="mt-3">
      <v-col>
        <v-btn block rounded :to="{ name: 'ideas-me' }"
          >Get Started!
          <v-icon small class="ml-2">mdi-arrow-right-circle</v-icon></v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Welcome2',
  data: () => ({
    email: null
  })
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';

.dailyText,
.ideaText {
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 2px;
}

.dailyText {
  color: $primary-color;
}

.ideaText {
  color: $secondary-color;
}
</style>
