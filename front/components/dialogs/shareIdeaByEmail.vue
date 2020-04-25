<template>
  <!-- Popup - Share Via Email -->
  <v-dialog
    v-model="visible"
    content-class="modal"
    persistent
    max-width="600px"
  >
    <div class="closeBtn">
      <v-icon text class="cancelIcon" @click="closeDialog">mdi-close</v-icon>
    </div>

    <!-- Header -->
    <section class="modalHeader">
      <h3>Share Idea With A Friend</h3>
      <v-img
        max-height="180"
        max-width="180"
        class="mx-auto modalTopImage"
        contain
        src="~/assets/images/dialogs/undraw_real_time_collaboration_c62i.svg"
      ></v-img>
    </section>

    <!-- Body -->
    <section class="modalBody">
      <form id="share-idea-without-login-form" @submit.stop.prevent="sendEmail">
        <v-text-field
          v-model="form.name"
          v-validate="'required|max:100'"
          :error-messages="errors.collect('name')"
          data-vv-name="name"
          label="Your Name"
          single-line
          flat
          placeholder="Your Name"
          prepend-inner-icon="mdi-account-circle-outline"
        >
        </v-text-field>
        <v-text-field
          v-model="form.friendName"
          v-validate="'required|max:100'"
          :error-messages="errors.collect('friend name')"
          data-vv-name="friend name"
          label="Your Friend's Name"
          placeholder="Your Friend's Name"
          single-line
          flat
          prepend-inner-icon="mdi-account-circle-outline"
        ></v-text-field>
        <v-text-field
          v-model="form.friendEmail"
          v-validate="'required|email|max:100'"
          :error-messages="errors.collect('email')"
          data-vv-name="email"
          label="Your Friend's Email"
          single-line
          flat
          placeholder="Your Friend's Email"
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field>
      </form>
    </section>

    <section class="modalFooter">
      <!-- Action Buttons -->
      <div class="text-right">
        <v-btn class="cancelBtn"
          rounded
          text
          @click="closeDialog"
          >Cancel</v-btn>
        <v-btn
          rounded
          type="submit"
          :loading="sendingEmail"
          @click.stop.prevent="sendEmail"
          >Share</v-btn
        >
      </div>
      <div class="mt-3 text-center">
        <client-only>
          <a
            class="muted smaller"
            v-clipboard="() => getShareUrl()"
            href="#"
            @click.prevent.stop="onCopyShareLink"
            >Copy link to clipboard instead</a
          >
        </client-only>
      </div>
    </section>

  </v-dialog>
</template>

<script>
import shareIdea from '~/graphql/mutations/shareIdea'

export default {
  $_veeValidate: {
    validator: 'new'
  },
  props: {
    // Show loggedin or loggedout header
    visible: {
      type: Boolean,
      default: true
    },
    ideaId: {
      type: String,
      default: null
    },
    ideaOwnerId: {
      type: String,
      default: null
    }
  },
  data: () => ({
    valid: true,
    form: {
      name: '',
      friendName: '',
      friendEmail: ''
    },
    sendingEmail: false
  }),
  computed: {
    initialName() {
      return this.$store.getters['userData/userName']
    }
  },
  mounted() {
    this.form.name = this.initialName
  },
  methods: {
    cleanData() {
      this.sendingEmail = false
      this.form = {
        name: this.initialName,
        friendName: '',
        friendEmail: ''
      }
      this.errors.clear()
    },
    getShareUrl() {
      return document.location.href
    },
    async sendEmail() {
      const result = await this.$validator.validateAll()
      if (!result) {
        return
      }

      this.sendingEmail = true

      // Call shre idea over email api.
      try {
        await this.$amplifyApi.graphql({
          query: shareIdea,
          variables: {
            ideaId: this.ideaId,
            ideaOwnerId: this.ideaOwnerId,
            email: this.form.friendEmail,
            senderName: this.form.name,
            friendName: this.form.friendName
          },
          authMode: this.$store.state['userData/isAuthenticated']
            ? undefined
            : 'API_KEY'
        })
        this.$emit('success')
      } catch (e) {
        this.$emit('error')
      }
      this.close()
      this.cleanData()
    },
    close() {
      this.$validator.reset()
      this.$emit('close')
      this.cleanData()
    },
    closeDialog() {
      this.close()
    },
    onCopyShareLink() {
      this.$emit('onCopyShareLink')
      this.close()
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style/common';
@import '~assets/style/modals';
</style>
