<template>
  <footer>
    <v-row>
      <v-col cols="12" class="text-center ">
        <n-link class="text-decoration-none" to="/about">About</n-link>
        <n-link class="text-decoration-none" to="/faq">FAQ</n-link>
        <n-link class="text-decoration-none" to="/terms"
          >Terms &amp; Conditions</n-link
        >
        <n-link class="text-decoration-none" to="/privacy">Privacy</n-link>
      </v-col>

      <v-col cols="12" class="text-center ">
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
