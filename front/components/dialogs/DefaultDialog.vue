<!-- eslint-disable vue/no-v-html -->
<template>
  <v-dialog
    :value="value"
    :content-class="contentClass"
    max-width="600"
    @input="v => $emit('input', v)"
  >
    <div class="closeBtn">
      <v-icon text class="cancelIcon" @click="hide">mdi-close</v-icon>
    </div>

    <slot name="header">
      <!-- Header -->
      <section class="modalHeader">
        <h3 v-if="header">{{ header }}</h3>
        <p v-if="subheader" v-html="subheader"></p>
        <v-img
          v-if="imagePath"
          max-height="180"
          :max-width="maxImageWidth"
          class="mx-auto modalTopImage mb-8"
          contain
          :src="imagePath"
        ></v-img>
      </section>
    </slot>

    <!-- Body -->
    <section class="modalBody">
      <slot />
    </section>

    <slot name="footer">
      <section class="modalFooter">
        <!-- Action Buttons -->
        <div
          class="text-right d-flex flex-row justify-space-around align-center"
        >
          <v-btn
            v-if="showCancelButton"
            class="cancelBtn"
            rounded
            text
            @click="cancelAndHide"
            >{{ buttonCancelText }}</v-btn
          >
          <span v-if="showCancelButton" class="grey-bar"></span>
          <v-btn
            v-if="showOkButton"
            rounded
            dark
            color="primary"
            :disabled="buttonOkDisabled"
            :loading="buttonOkLoading"
            :class="{ error: error }"
            @click="$emit('ok')"
            >{{ buttonOkText }}</v-btn
          >
        </div>
      </section>
    </slot>
    <slot name="after-footer"></slot>
  </v-dialog>
</template>

<script>
export default {
  props: {
    header: { type: String, default: '' },
    subheader: { type: String, default: '' },
    error: { type: Boolean, default: false },
    imagePath: { type: String, default: '' },
    value: Boolean,
    buttonOkText: { type: String, default: 'Ok' },
    buttonCancelText: { type: String, default: 'Cancel' },
    buttonOkDisabled: { type: Boolean, default: false },
    buttonOkLoading: { type: Boolean, default: false },
    showCancelButton: { type: Boolean, default: true },
    showOkButton: { type: Boolean, default: true },
    contentClass: { type: String, default: 'modal' },
    maxImageWidth: { type: Number, default: 180 }
  },

  methods: {
    cancelAndHide() {
      this.$emit('cancel')
      this.hide()
    },

    hide() {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .v-dialog {
    border-radius: 10px;
  }
}
</style>
