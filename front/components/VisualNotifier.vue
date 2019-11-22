<template>
  <v-snackbar
    v-model="snackbarVisible"
    :absolute="true"
    :timeout="2000"
    :color="color"
  >
    {{ message }}
    <v-btn color="white" text @click="close">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'SnackBarNotifier',
  data() {
    return {
      message: '',
      color: '',
      snackbarVisible: false
    }
  },
  methods: {
    success(message) {
      this.message = message
      this.color = 'success'
      this.snackbarVisible = true
    },
    error(message) {
      this.message = message
      this.color = 'error'
      this.snackbarVisible = true
    },
    close() {
      this.snackbarVisible = false
    }
  }
}
</script>
