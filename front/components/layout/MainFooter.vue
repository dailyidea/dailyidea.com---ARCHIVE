<template>
  <footer>
    <v-row>
      <v-col cols="12" sm="6" class="text-center text-sm-left">
        <n-link to="/about">About</n-link>
        <n-link to="/faq">FAQ</n-link>
        <n-link to="/terms">Terms &amp; Conditions</n-link>
        <n-link to="/privacy">Privacy</n-link>
      </v-col>
      <v-col cols="12" sm="6" class="text-center text-sm-right">
        <span>Copyright Daily Idea © 2020</span>
      </v-col>
    </v-row>
  </footer>
</template>

<style lang="scss" scoped>
  footer {
    border-top: 0.2px solid #e8e8e8;
    padding-top: 20px;

    a {
      padding-right: 1rem;
    }
  }
</style>
