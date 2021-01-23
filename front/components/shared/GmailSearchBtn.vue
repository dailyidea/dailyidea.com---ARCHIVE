<template>
  <v-btn
    v-if="isGmail"
    rounded
    color="primary"
    :href="
      `https://mail.google.com/mail/u/0/#search/in%3Aanywhere+subject%3A%22${search}%22+${dates}`
    "
    target="_blank"
    rel="noopener"
    >Check your Gmail inbox
  </v-btn>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    email: { type: String, required: true },
    search: { type: String, required: true }
  },

  computed: {
    isGmail() {
      return this.email && this.email.match(/gmail.com$/i)
    },

    dates() {
      return encodeURIComponent(
        'after:' +
          dayjs().format('YYYY/M/D') +
          ' before:' +
          dayjs()
            .add(1, 'day')
            .format('YYYY/M/D')
      )
    }
  }
}
</script>
