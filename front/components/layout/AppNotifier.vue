<template>
  <v-snackbar v-model="visible" :timeout="timeout" :color="color" right top>
    {{ message }}
    <v-btn color="white" text @click="close">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
import Notifier from '@/plugins/app-notifier'

const initialData = {
  visible: false,
  message: '',
  color: '',
  timeout: 2000
}

export default {
  data() {
    return Object.assign({}, initialData)
  },

  beforeMount() {
    Notifier.eventBus.$on('show', params => this.show(params))
    Notifier.eventBus.$on('success', params => this.success(params))
    Notifier.eventBus.$on('error', params => this.error(params))
  },

  methods: {
    close() {
      this.visible = false
    },

    confirm() {
      this.visible = false
    },

    show(params) {
      Object.assign(this, Object.assign({}, initialData), params)
      this.visible = true
    },

    success(params) {
      if (typeof params === 'string') {
        params = { message: params }
      }
      this.show(Object.assign(params, { color: 'green' }))
    },

    error(params) {
      if (typeof params === 'string') {
        params = { message: params }
      }
      this.show(Object.assign(params, { color: 'red' }))
    }
  }
}
</script>
