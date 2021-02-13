<template>
  <default-dialog
    :value="value"
    :header="name ? `Welcome Back ${name}!` : 'Welcome to Daily Idea!'"
    :subheader="message"
    :image-path="require('assets/images/dialogs/dialog_welcome_back.svg')"
    @input="v => $emit('input', v)"
  >
    <div class="text-center">
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
    email: { type: String, required: true }
  }
}
</script>
