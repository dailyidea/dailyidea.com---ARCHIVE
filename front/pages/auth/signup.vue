<template>
  <v-form>
    <v-container>
      <v-layout row>
        <v-flex>
          <p class="dash-trailing">Get Started With A Free Account.</p>
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
      <v-btn @click="signup">Signup</v-btn>

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
    async signup() {
      await this.$store.dispatch('cognito/registerUser', {
        username: this.username,
        password: this.password
      })
    }
  }
}
</script>
