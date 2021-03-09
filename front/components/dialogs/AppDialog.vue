<!-- eslint-disable vue/no-v-html -->
<template>
  <default-dialog
    v-model="visible"
    :header="header"
    :subheader="subheader"
    :show-cancel-button="showCancelButton"
    :max-image-width="maxImageWidth"
    :button-ok-text="buttonOkText"
    :image-path="imagePath"
    :error="error"
    @ok="confirm"
    @cancel="cancel"
  >
    <p>{{ message }}</p>
  </default-dialog>
</template>

<script>
import Dialog from '@/plugins/app-dialog'
import DefaultDialog from '@/components/dialogs/DefaultDialog'

const initialData = {
  visible: false,
  header: '',
  subheader: '',
  message: '',
  error: false,
  showCancelButton: false,
  buttonOkText: 'Ok',
  imagePath: '',
  resolve: null,
  maxImageWidth: 180
}

export default {
  components: {
    DefaultDialog
  },

  data() {
    return Object.assign({}, initialData)
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
      Object.assign(this, Object.assign({}, initialData), params)
      this.resolve = resolve
      this.visible = true
    }
  }
}
</script>
