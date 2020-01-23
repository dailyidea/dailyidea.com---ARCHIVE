<!-- eslint-disable vue/no-v-html -->
<template>
  <v-dialog
    v-model="visible"
    content-class="simple-dialog-popup-content"
    persistent
    max-width="600"
  >
    <v-card>
      <v-icon
        text
        class="simple-dialog-popup-content__cancel-icon"
        size="20"
        @click="close"
        >fas fa-times</v-icon
      >
      <v-card-title v-if="header" class="headline">{{ header }}</v-card-title>
      <v-card-text v-html="body"></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="buttonCancel" text @click="close">{{
          buttonCancel
        }}</v-btn>
        <v-btn @click="ok">{{ buttonOk }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SimpleDialogPopup',
  data() {
    return {
      visible: false,
      header: '',
      body: '',
      buttonOk: '',
      buttonCancel: ''
    }
  },
  methods: {
    show(header = '', body = '', buttonOk = 'OK', buttonCancel = 'Cancel') {
      this.header = header
      this.body = body
      this.buttonOk = buttonOk
      this.buttonCancel = buttonCancel
      this.visible = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    close() {
      this.visible = false
      this.resolve(false)
    },
    ok() {
      this.visible = false
      this.resolve(true)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .simple-dialog-popup-content {
  position: relative;

  &__cancel-icon {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
