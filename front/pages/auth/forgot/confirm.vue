<template>
  <v-form>
    <v-container>
      <v-layout row>
        <v-flex>
          <p class="dash-trailing">Confirm new password.</p>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex>
          <v-text-field v-model="username" label="username" />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex>
          <v-text-field v-model="code" label="code" />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex>
          <v-text-field v-model="newPassword" label="newPassword" />
        </v-flex>
      </v-layout>
      <v-btn @click="login">Forgot Password</v-btn>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    username: '',
    code: '',
    newPassword: ''
  }),
  methods: {
    async forgotPassword() {
      await this.$store.dispatch('cognito/forgotPassword', {
        username: this.username,
        code: this.code,
        newPassword: this.newPassword
      })
    }
  }
}
</script>
