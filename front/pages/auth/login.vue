<template>
  <v-form>
    <v-container>
      <v-layout row>
        <v-flex>
          <p class="dash-trailing">Login.</p>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex>
          <v-text-field v-model="username" label="username" />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex>
          <v-text-field v-model="password" label="password" />
        </v-flex>
      </v-layout>
      <v-btn @click="login">Login</v-btn>

    </v-container>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    username: '',
    password: ''
  }),
  methods: {
    async login() {
      await this.$store.dispatch('cognito/signInUser', {
        username: this.username,
        password: this.password
      })
    }
  }
}
</script>
