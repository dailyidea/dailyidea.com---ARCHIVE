<template>
  <v-dialog
    v-model="visible"
    content-class="modal"
    persistent
    max-width="600"
  >
    <div class="closeBtn">
      <v-icon text class="cancelIcon" @click="close">mdi-close</v-icon>
    </div>

    <!-- Header -->
    <section class="modalHeader">
      <h3>{{ header }}</h3>
      <v-img v-if="imagePath"
             max-height="180"
             max-width="180"
             class="mx-auto modalTopImage"
             contain
             :src="imagePath"
      ></v-img>
    </section>

    <!-- Body -->
    <section class="modalBody">
      {{ message }}

      <form id="share-idea-without-login-form" @submit.stop.prevent="ok">
        <v-text-field
          ref="focus"
          v-model="name"
          v-validate="'required|max:100'"
          :error-messages="errors.collect('name')"
          data-vv-name="name"
          class="inputBox name"
          single-line
          flat
          label="First name"
          prepend-inner-icon="fas fa-user"
          @keydown.enter="ok"
        ></v-text-field>
      </form>
    </section>

    <section class="modalFooter">
      <!-- Action Buttons -->
      <div class="text-right">
        <v-btn class="cancelBtn" rounded text @click="close">{{
          buttonCancelText
          }}</v-btn>
        <v-btn :disabled="!allowSave" rounded @click="ok">{{ buttonOkText }}</v-btn>
      </div>
    </section>
  </v-dialog>
</template>

<script>
export default {
  name: 'OnUnAuthAddIdeaAskNameDialog',
  $_veeValidate: {
    validator: 'new'
  },
  data() {
    return {
      visible: false,
      name: '',
      header: '',
      message: '',
      buttonOkText: '',
      buttonCancelText: '',
      imagePath: '',
    }
  },
  computed: {
    allowSave() {
      return this.name && this.errors.items.length === 0
    }
  },
  methods: {
    show(header, message, buttonOkText, buttonCancelText, imagePath) {
      this.header = header
      this.message = message
      this.buttonOkText = buttonOkText
      this.buttonCancelText = buttonCancelText
      this.imagePath = imagePath
      this.name = ''
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
      this.resolve(this.name)
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
