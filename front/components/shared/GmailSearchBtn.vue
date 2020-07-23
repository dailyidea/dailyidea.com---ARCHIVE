<template>
  <v-btn
    v-if="isGmail"
    rounded
    :href="
      `https://mail.google.com/mail/u/0/#search/in%3Aanywhere+subject%3A%22${search}%22`
    "
    target="_blank"
    >Check your Gmail inbox
  </v-btn>
</template>

<script>
export default {
  props: {
    email: {
      type: String,
      required: true
    },
    search: {
      type: String,
      required: true
    }
  },

  computed: {
    isGmail() {
      return this.email && this.email.match(/gmail.com$/i)
    }
  }
}
</script>
