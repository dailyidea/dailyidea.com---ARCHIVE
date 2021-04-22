<template>
  <default-dialog
    :value="value"
    :header="name ? `Welcome Back ${name}!` : 'Welcome to Daily Idea!'"
    :subheader="message"
    :image-path="require('assets/images/dialogs/dialog_welcome_back.svg')"
    :show-close-button="showCloseButton"
    :persistent="persistent"
    content-class="modal relative"
    @input="v => $emit('input', v)"
  >
    <div class="text-center">
      <a
        v-if="showBackButton"
        role="button"
        class="back-button"
        @click="$router.go(-1)"
      >
        <v-icon>mdi mdi-chevron-left</v-icon>
        Back
      </a>
      <gmail-search-btn
        :email="email"
        :search="`[Daily+Idea]+${name ? 'Log+in+link' : 'Magic+link'}`"
        class="mb-6"
      />
    </div>
    <template v-slot:footer>
      <p class="text-center">
        <a href="#" class="link-highlight" @click.prevent="$emit('resend')"
          >Request a new link to {{ email }}</a
        >
      </p>
    </template>
  </default-dialog>
</template>

<script>
import DefaultDialog from '@/components/dialogs/DefaultDialog'
import GmailSearchBtn from '@/components/shared/GmailSearchBtn'

export default {
  components: {
    GmailSearchBtn,
    DefaultDialog
  },

  props: {
    value: Boolean,
    message: { type: String, default: 'Your Email?' },
    name: { type: String, default: '' },
    email: { type: String, required: true },
    showCloseButton: { type: Boolean, default: true },
    persistent: { type: Boolean, default: false },
    showBackButton: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
.back-button {
  i {
    font-size: 2rem;
    margin-right: -7px;
    margin-top: -3px;
  }
  position: absolute;
  top: 5px;
  left: 0;
  display: block;
  color: rgba(0, 0, 0, 0.54);
}
</style>
