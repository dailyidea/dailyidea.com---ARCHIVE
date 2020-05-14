<!-- eslint-disable vue/no-v-html -->
<template>
  <default-dialog
    :show="visible"
    :header="header"
    :show-cancel-button="showCancelButton"
    @hide="() => (visible = false)"
    @ok="confirm"
    @cancel="cancel"
  >
    <p>{{ message }}</p>
  </default-dialog>
</template>

<script>
import Dialog from '@/plugins/app-dialog'
import DefaultDialog from '@/components/dialogs/DefaultDialog'

export default {
  components: {
    DefaultDialog
  },

  data() {
    return {
      visible: false,
      header: '',
      message: '',
      showCancelButton: false,
      resolve: null
    }
  },

  beforeMount() {
    Dialog.eventBus.$on('show', (params, resolve) => {
      this.show(params, resolve)
    })
  },

  methods: {
    cancel() {
      this.visible = false
      this.resolve(false)
    },

    confirm() {
      this.visible = false
      this.resolve(true)
    },

    show(params, resolve) {
      this.visible = true
      this.resolve = resolve
      Object.assign(this, params)
    }
  }
}
</script>
