<template>
  <card-layout>
    <div class="text-center" style="position: relative; width: 100%;">
      <v-progress-linear
        :indeterminate="true"
        :active="sending"
        :height="2"
        absolute
      ></v-progress-linear>

      <h1 class="mt-8 mb-5 font-weight-regular text-h3">
        Looks like this link is expired.
      </h1>
      <p class="mb-10" style="font-size: 1.25rem; line-height: 1.2;">
        The good news is that we just sent a new confirmation link to<br />
        {{ email }}
      </p>
      <div class="ml-12 pl-2">
        <img width="325" src="@/assets/images/bird-illustration.png" alt="" />
      </div>
      <div v-if="!hideSend" style="margin-top: -70px;">
        <a href="#" class="link-highlight" @click.prevent="send2ndTime">
          Resend link
        </a>
      </div>
    </div>
  </card-layout>
</template>

<script>
import CardLayout from '@/components/layout/CardLayout'

export default {
  components: { CardLayout },

  props: {
    email: { type: String, required: true },
    next: { type: String, default: null }
  },

  data: () => ({ sending: false, hideSend: false }),

  mounted() {
    this.sendEmail()
  },

  methods: {
    async send2ndTime() {
      await this.sendEmail()
      this.hideSend = true
      setTimeout(() => {
        this.hideSend = false
      }, 30000)
    },

    async sendEmail() {
      if (this.sending) {
        return
      }
      this.sending = true
      await this.$amplifyApi.post('RequestLogin', '', {
        body: {
          email: this.email.toLowerCase(),
          next: this.$route.query.r,
          isMobile: this.$vuetify.breakpoint.smAndDown
        }
      })
      this.sending = false
    }
  }
}
</script>
