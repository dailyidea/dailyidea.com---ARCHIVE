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
    email: String,
    search: String
  },

  computed: {
    isGmail() {
      return this.email && this.email.match(/gmail.com$/i)
    }
  }
}
</script>
