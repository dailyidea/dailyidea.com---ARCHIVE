<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="page-title">
          Saving Your Own Ideas
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <p>
          Every day, we'll send you a simple reminder to come up with a new idea.
        </p>
        <p>
          Just respond in your email and we'll automatically save it for you.
        </p>
        <p>
          <strong>If you're the kind of person that is overflowing with ideas</strong>, you can log
          your ideas here.
          We'll remind you periodically about your best ideas and show you similar
          ideas that to spark your creativity.
        </p>
        <p>
          <strong>If you only have a few ideas</strong>, this will help you exercise your idea
          muscle. With repeated, deliberate practice, coming up with ideas becomes second nature.
          Over time, you'll become an idea machine!
        </p>
      </v-col>
    </v-row>

    <v-row class="mt-3">
      <v-col>
        <v-btn block rounded :to="{name: 'welcome-3'}">Browsing Other Ideas <v-icon small class="ml-2">mdi-arrow-right-circle</v-icon></v-btn>
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
