<template>
  <v-dialog
    v-model="visible"
    content-class="dialog-popup-content"
    persistent
    max-width="600"
  >
    <v-card>
      <v-icon
        text
        class="dialog-popup-content__cancel-icon"
        size="20"
        @click="close"
        >fas fa-times
      </v-icon>
      <v-card-title class="headline">{{ header }}</v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-text>
        <v-text-field
          ref="focus"
          v-model="email"
          v-validate="'required|email|max:100'"
          data-vv-validate-on="input"
          append-icon="email"
          :error-messages="errors.collect('email')"
          data-vv-name="email"
          label="Your Email"
          single-line
          flat
          @keydown.enter="ok"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancel">{{ buttonCancelText }}</v-btn>
        <v-btn :disabled="!allowSave" @click="ok">{{ buttonOkText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'OnUnAuthAddIdeaAskEmailDialog',
  $_veeValidate: {
    validator: 'new'
  },
  data() {
    return {
      visible: false,
      email: '',
      header: '',
      message: '',
      buttonOkText: '',
      buttonCancelText: ''
    }
  },
  computed: {
    allowSave() {
      return this.email && this.errors.items.length === 0
    }
  },
  methods: {
    show(header, message, buttonOkText, buttonCancelText) {
      this.header = header
      this.message = message
      this.buttonOkText = buttonOkText
      this.buttonCancelText = buttonCancelText
      this.email = ''
      this.$validator.reset()
      this.visible = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.focus.focus()
        }, 100)
      })
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    close() {
      this.visible = false
      this.reject('close')
    },
    cancel() {
      this.visible = false
      this.reject('cancel')
    },
    ok() {
      if (!this.allowSave) {
        return
      }
      this.visible = false
      this.resolve(this.email)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .dialog-popup-content {
  position: relative;

  &__cancel-icon {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
