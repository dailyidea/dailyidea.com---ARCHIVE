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
      <v-card-title class="headline">Introduce yourself?</v-card-title>
      <v-card-text>
        Before we post this for everyone to see, can you please confirm your
        email address?
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
        <v-btn text @click="cancel">delete comment</v-btn>
        <v-btn :disabled="!allowSave" @click="ok">OK</v-btn>
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
      email: ''
    }
  },
  computed: {
    allowSave() {
      return this.email && this.errors.items.length === 0
    }
  },
  methods: {
    show() {
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
