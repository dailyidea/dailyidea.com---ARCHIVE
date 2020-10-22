<template>
  <validation-observer
    ref="validator"
    v-slot="{ valid, validated, handleSubmit }"
  >
    <default-dialog
      :value="value"
      :image-path="
        require('~/assets/images/dialogs/undraw_real_time_collaboration_c62i.svg')
      "
      :button-ok-loading="sendingEmail"
      :button-ok-disabled="!valid || !validated"
      button-ok-text="Share"
      header="Share Idea With A Friend"
      @input="v => $emit('input', v)"
      @ok="handleSubmit(sendEmail)"
    >
      <form
        id="share-idea-without-login-form"
        @submit.stop.prevent="handleSubmit(sendEmail)"
      >
        <v-text-field-with-validation
          v-if="!initialName"
          v-model="form.name"
          rules="required|max:100"
          name="Name"
          label="Your Name"
          single-line
          flat
          placeholder="Your Name"
          prepend-inner-icon="mdi-account-circle-outline"
        >
        </v-text-field-with-validation>
        <v-text-field-with-validation
          v-model="form.friendName"
          rules="required|max:100"
          name="Friend name"
          label="Your Friend's Name"
          placeholder="Your Friend's Name"
          single-line
          flat
          prepend-inner-icon="mdi-account-circle-outline"
        ></v-text-field-with-validation>
        <v-text-field-with-validation
          v-model="form.friendEmail"
          rules="required|email|max:100"
          name="email"
          label="Your Friend's Email"
          single-line
          flat
          placeholder="Your Friend's Email"
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field-with-validation>
      </form>

      <template v-slot:after-footer>
        <section class="modalFooter">
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
  </validation-observer>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import { mapGetters } from 'vuex'
import DefaultDialog from '@/components/dialogs/DefaultDialog'
import shareIdea from '~/graphql/mutations/shareIdea'
import VTextFieldWithValidation from '@/components/validation/VTextFieldWithValidation'

export default {
  components: {
    VTextFieldWithValidation,
    DefaultDialog,
    ValidationObserver
  },

  props: {
    // Show loggedin or loggedout header
    value: Boolean,
    ideaId: { type: String, default: null },
    ideaOwnerId: { type: String, default: null }
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

  computed: { ...mapGetters({ initialName: 'userData/userName' }) },

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
      this.$refs.validator.reset()
    },

    getShareUrl() {
      return document.location.href
    },

    async sendEmail() {
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
      this.$refs.validator.reset()
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
