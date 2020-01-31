<template>
  <v-dialog
    v-model="visible"
    content-class="dialog-popup-content"
    persistent
    max-width="500"
  >
    <v-card>
      <v-icon
        text
        class="dialog-popup-content__cancel-icon"
        size="20"
        @click="close"
        >fas fa-times
      </v-icon>
      <v-card-title class="headline">Update Avatar</v-card-title>
      <v-card-text
        >Select image area for your avatar on preview below</v-card-text
      >
      <v-card-text>
        <Cropper
          ref="cropper"
          classname="cropper"
          :stencil-component="CircleStencil"
          :src="image"
          :max-width="1200"
          :max-height="1200"
          :restrictions="pixelsRestriction"
        ></Cropper>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn :loading="uploadingAvatar" @click="select">Select</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Cropper, CircleStencil } from 'vue-advanced-cropper'

export default {
  name: 'UserProfileAvatarCropDialog',
  components: { Cropper },
  data() {
    return {
      visible: false,
      image: undefined,
      CircleStencil,
      uploadingAvatar: false
    }
  },
  methods: {
    show(image) {
      this.visible = true
      this.image = image
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    close() {
      this.visible = false
      this.reject(false)
    },
    pixelsRestriction({
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      imageWidth,
      imageHeight
    }) {
      return {
        minWidth,
        minHeight,
        maxWidth,
        maxHeight
      }
    },
    select() {
      const { canvas } = this.$refs.cropper.getResult()
      const imageToUpload = canvas.toDataURL('image/jpeg', 1.0)
      this.resolve(imageToUpload)
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .dialog-popup-content {
  position: relative;
  background-color: white;

  &__cancel-icon {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
.cropper {
  /*border: solid 1px #EEE;*/
  height: 300px;
  width: 100%;
}
</style>
