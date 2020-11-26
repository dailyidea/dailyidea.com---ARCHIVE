<template>
  <v-snackbar
    v-model="visible"
    :timeout="timeout"
    :color="color"
    right
    top
    @click.native="visible = false"
  >
    {{ message }}
    <img v-if="icon" :src="icon" alt="Icon" />
  </v-snackbar>
</template>

<script>
import Notifier from '@/plugins/app-notifier'

const initialData = {
  visible: false,
  message: '',
  color: '',
  timeout: 2000,
  icon: null
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

<style lang="scss" scoped>
::v-deep {
  .v-sheet.v-snack__wrapper {
    border-radius: 0;
  }
  .v-sheet.v-snack__wrapper:not(.v-sheet--outlined) {
    box-shadow: none;
  }
  .v-snack__wrapper.theme--dark {
    width: 100%;
    max-width: none;
    margin: 0;
  }
  .v-snack__content {
    text-align: center;
    font-size: 1rem;
  }

  .green {
    background: linear-gradient(#e9ece8, #f9fcf7) !important;
    border-top: 1px solid #569e34;
    border-bottom: 1px solid #569e34;
    .v-snack__content {
      color: #306117;
    }
  }
  .red {
    background: #feeff0 !important;
    border-top: 1px solid #dc4140;
    border-bottom: 1px solid #dc4140;
    .v-snack__content {
      color: #bb1817;
    }
  }
}
</style>
