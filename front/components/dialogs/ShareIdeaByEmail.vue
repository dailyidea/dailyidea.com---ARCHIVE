<template>
  <default-dialog
    :value="value"
    :image-path="
      require('~/assets/images/dialogs/undraw_real_time_collaboration_c62i.svg')
    "
    header="Share Idea With A Friend"
    @input="v => $emit('input', v)"
  >
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

    <template v-slot:footer>
      <section class="modalFooter">
        <!-- Action Buttons -->
        <div class="text-right">
          <v-btn class="cancelBtn" rounded text @click="close">Cancel</v-btn>
          <v-btn rounded :loading="sendingEmail" @click="sendEmail"
            >Share</v-btn
          >
        </div>
        <div class="mt-3 text-center">
          <client-only>
            <a
              v-clipboard="() => getShareUrl()"
              class="muted smaller"
              href="#"
              @click.prevent.stop="onCopyShareLink"
              >Copy link to clipboard instead</a
            >
          </client-only>
        </div>
      </section>
    </template>
  </default-dialog>
</template>

<script>
import shareIdea from '~/graphql/mutations/shareIdea'
import DefaultDialog from '@/components/dialogs/DefaultDialog'

export default {
  $_veeValidate: {
    validator: 'new'
  },

  components: {
    DefaultDialog
  },

  props: {
    // Show loggedin or loggedout header
    value: Boolean,
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
      this.$emit('input', false)
      this.cleanData()
    },

    onCopyShareLink() {
      this.$emit('onCopyShareLink')
      this.close()
    }
  }
}
</script>
