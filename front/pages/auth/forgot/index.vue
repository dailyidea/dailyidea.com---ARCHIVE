<template>
  <v-form>
    <v-container>
      <v-layout row>
        <v-flex>
          <p class="dash-trailing">Forgot Password.</p>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex>
          <v-text-field v-model="username" label="username" />
        </v-flex>
      </v-layout>
      <v-btn @click="forgotPassword">Forgot Password</v-btn>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    username: ''
  }),
  methods: {
    async forgotPassword() {
      await this.$store.dispatch('cognito/forgotPassword', {
        username: this.username
      })
    }
  }
}
</script>
