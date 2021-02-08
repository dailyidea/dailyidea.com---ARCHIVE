<template>
  <v-dialog
    :value="value"
    :content-class="'modal' + (copyToClipboard ? ' flipped' : '')"
    max-width="600"
    @input="v => $emit('input', v)"
  >
    <div class="dialog-inner">
      <div v-if="!askName" class="dialog-front">
        <div class="closeBtn">
          <v-icon text class="cancelIcon" @click="$emit('input', false)"
            >mdi-close</v-icon
          >
        </div>

        <section class="modalHeader">
          <h3>Share this Idea</h3>
          <p>Enter your your friend’s email address or copy the link below.</p>
        </section>

        <v-text-field-with-validation
          v-model="form.friendEmail"
          rules="required|email|max:100"
          name="email"
          single-line
          flat
          placeholder="Your friend’s email address"
          prepend-inner-icon="$vuetify.icons.mail"
          :valid.sync="emailValid"
          @keyup.enter="emailValid && (askName = true)"
        ></v-text-field-with-validation>
        <div class="mt-3 text-center">
          <v-btn
            :disabled="!emailValid"
            dark
            color="primary"
            :loading="sendingEmail"
            @click="emailValid && (askName = true)"
            >Next</v-btn
          >
        </div>
        <div class="mt-6 text-center">
          <client-only>
            <a
              class="link-highlight"
              href="#"
              @click.prevent.stop="
                ;(copyToClipboard = true) && clipboard(getShareUrl())
              "
              >Copy link to clipboard instead</a
            >
          </client-only>
        </div>
        <div class="text-center mt-4">
          <slider-dots :total="2" :step="0" />
        </div>
      </div>

      <div v-if="askName" class="dialog-front">
        <div class="closeBtn">
          <v-icon text class="cancelIcon" @click="$emit('input', false)"
            >mdi-close</v-icon
          >
        </div>

        <section class="modalHeader">
          <h3>Who should we say it’s from?</h3>
          <p>Enter your your friend’s email address or copy the link below.</p>
        </section>

        <v-text-field-with-validation
          v-model="form.name"
          rules="required|max:100"
          name="name"
          single-line
          flat
          placeholder="Your name (so your friend knows who is sending it to them)"
          prepend-inner-icon="$vuetify.icons.user"
          :valid.sync="nameValid"
          @keyup.enter="sendEmail"
        ></v-text-field-with-validation>
        <div class="mt-3 text-center">
          <v-btn
            :disabled="!nameValid"
            dark
            color="primary"
            :loading="sendingEmail"
            @click="sendEmail"
            >Submit</v-btn
          >
        </div>
        <div class="text-center mt-4">
          <slider-dots
            :total="2"
            :step="1"
            @click="
              n => {
                if (n === 0) askName = false
              }
            "
          />
        </div>
      </div>

      <div class="dialog-back">
        <div class="closeBtn">
          <v-icon text class="cancelIcon" @click="$emit('input', false)"
            >mdi-close</v-icon
          >
        </div>

        <section class="modalHeader">
          <h3>Share this Idea</h3>
          <p>This is the direct link to the idea: “{{ idea.title }}”</p>
        </section>

        <v-text-field
          :value="getShareUrl()"
          single-line
          flat
          prepend-inner-icon="$vuetify.icons.link"
          append-icon="$vuetify.icons.check_copied"
        >
          <template v-slot:append>
            <span class="color-primary italic" style="margin: 4px 5px 0;"
              >copied</span
            >
            <v-icon>$vuetify.icons.check</v-icon>
          </template>
        </v-text-field>

        <div class="mt-3 text-center">
          <v-btn dark color="primary" @click="$emit('input', false)">Ok</v-btn>
        </div>

        <div class="mt-6 text-center">
          <a
            class="link-highlight"
            href="#"
            @click.prevent.stop="copyToClipboard = false"
            >Share via email instead</a
          >
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import VTextFieldWithValidation from '@/components/validation/VTextFieldWithValidation'
import shareIdea from '~/graphql/mutations/shareIdea'
import SliderDots from '@/components/layout/svgIcons/SliderDots'

export default {
  components: {
    SliderDots,
    VTextFieldWithValidation
  },

  props: {
    value: Boolean,
    idea: { type: Object, required: true }
  },

  data: () => ({
    valid: true,
    form: {
      name: '',
      friendEmail: ''
    },
    emailValid: false,
    nameValid: false,
    sendingEmail: false,
    askName: false,
    copyToClipboard: false
  }),

  computed: {
    ...mapGetters({
      initialName: 'userData/userName',
      isAuthenticated: 'userData/isAuthenticated'
    })
  },

  mounted() {
    this.form.name = this.initialName
  },

  methods: {
    cleanData() {
      this.sendingEmail = false
      this.askName = false
      this.form = {
        name: this.initialName,
        // friendName: '',
        friendEmail: ''
      }
    },

    getShareUrl() {
      if (typeof location === 'undefined') {
        return ''
      }
      return `${location.origin}/i/${this.idea.shortId}/${this.idea.slug}`
    },

    async sendEmail() {
      if (!this.emailValid) {
        return
      }
      this.sendingEmail = true

      // Call shre idea over email api.
      try {
        await this.$amplifyApi.graphql({
          query: shareIdea,
          variables: {
            ideaId: this.idea.ideaId,
            ideaOwnerId: this.idea.userId,
            email: this.form.friendEmail,
            senderName: this.form.name,
            friendName: '' // this.form.friendName
          },
          authMode: this.isAuthenticated ? undefined : 'API_KEY'
        })
        this.$emit('success')
      } catch (e) {
        this.$emit('error')
      }
      this.cleanData()
      this.$emit('input', false)
    },

    clipboard(str) {
      const el = document.createElement('textarea')
      el.addEventListener('focusin', e => e.stopPropagation())
      el.value = str
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .v-dialog {
    border-radius: 10px;
  }

  .modal {
    overflow: visible;
    background: transparent;
    padding: 0;
    perspective: 1000px; /* Remove this if you don't want the 3D effect */
    box-shadow: none;
  }
}

.dialog-inner {
  width: 600px;
  height: 340px;
  max-width: 100%;
  position: relative;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%),
    0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);

  @media (max-width: $screen-xs-max) {
    height: 380px;
  }
}

.flipped .dialog-inner {
  transform: rotateY(180deg);
}

.dialog-front,
.dialog-back {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  background: white;
  backface-visibility: hidden;
  border-radius: 10px;
}
.dialog-front {
}
.dialog-back {
  transform: rotateY(180deg);
}
.closeBtn {
  backface-visibility: hidden;
}
</style>
