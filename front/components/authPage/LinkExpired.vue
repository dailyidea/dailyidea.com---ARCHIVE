<template>
  <Layout>
    <idea-card>
      <div class="text-center" style="position: relative; width: 100%;">
        <v-progress-linear
          :indeterminate="true"
          :active="sending"
          :height="2"
          absolute
        ></v-progress-linear>

        <h1 class="mt-5 font-weight-regular text-h1" style="font-size: 3rem;">
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
          <a href="#" @click.prevent="send2ndTime">
            <link-text active="active" text="Resend link"></link-text>
          </a>
        </div>
      </div>
    </idea-card>
  </Layout>
</template>

<script>
import Layout from '@/components/layout/Layout'
import IdeaCard from '@/components/ideaDetail/IdeaCard'
import LinkText from '@/components/layout/LinkText'

export default {
  components: { LinkText, IdeaCard, Layout },

  props: {
    email: { type: String, required: true },
    next: { type: String, default: null }
  },

  data: () => ({
    sending: false,
    hideSend: false
  }),

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
