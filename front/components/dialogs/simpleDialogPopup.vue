<!-- eslint-disable vue/no-v-html -->
<template>
  <v-dialog v-model="visible" content-class="modal" persistent max-width="600">
    <div class="closeBtn">
      <v-icon text class="cancelIcon" @click="close">mdi-close</v-icon>
    </div>

    <!-- Header -->
    <section class="modalHeader">
      <h3>{{ header }}</h3>
      <v-img
        v-if="imagePath"
        max-height="180"
        max-width="180"
        class="mx-auto modalTopImage"
        contain
        :src="imagePath"
      ></v-img>
    </section>

    <!-- Body -->
    <section class="modalBody">
      {{ body }}
    </section>

    <section class="modalFooter">
      <!-- Action Buttons -->
      <div class="text-right">
        <v-btn class="cancelBtn" rounded text @click="close">{{
          buttonCancel
        }}</v-btn>
        <v-btn rounded @click="ok">{{ buttonOk }}</v-btn>
      </div>
    </section>
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
      buttonCancel: '',
      imagePath: ''
    }
  },
  methods: {
    show(
      header = '',
      body = '',
      buttonOk = 'OK',
      buttonCancel = 'Cancel',
      imagePath
    ) {
      this.header = header
      this.body = body
      this.buttonOk = buttonOk
      this.buttonCancel = buttonCancel
      this.imagePath = imagePath
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

<style lang="scss">
@import '~assets/style/common';
@import '~assets/style/modals';
</style>
