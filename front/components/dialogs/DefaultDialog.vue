<!-- eslint-disable vue/no-v-html -->
<template>
  <v-dialog v-model="show" content-class="modal" persistent max-width="600">
    <div class="closeBtn">
      <v-icon text class="cancelIcon" @click="$emit('hide')">mdi-close</v-icon>
    </div>

    <slot name="header">
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
    </slot>

    <!-- Body -->
    <section class="modalBody">
      <slot />
    </section>

    <slot name="footer">
      <section class="modalFooter">
        <!-- Action Buttons -->
        <div class="text-right">
          <v-btn
            v-if="showCancelButton"
            class="cancelBtn"
            rounded
            text
            @click="$emit('cancel') && $emit('hide')"
            >{{ buttonCancelText }}</v-btn
          >
          <v-btn rounded :disabled="buttonOkDisabled" @click="$emit('ok')">{{
            buttonOkText
          }}</v-btn>
        </div>
      </section>
    </slot>
  </v-dialog>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      default: ''
    },
    imagePath: {
      type: String,
      default: ''
    },
    show: Boolean,
    buttonOkText: {
      type: String,
      default: 'Ok'
    },
    buttonCancelText: {
      type: String,
      default: 'Cancel'
    },
    buttonOkDisabled: {
      type: Boolean,
      default: false
    },
    showCancelButton: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';
@import '~assets/style/modals';
</style>
