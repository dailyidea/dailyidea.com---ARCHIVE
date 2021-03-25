<template>
  <v-dialog
    :value="value"
    :content-class="'modal' + (copyToClipboard ? ' flipped' : '')"
    max-width="600"
    @input="v => $emit('input', v)"
  >
    <div class="dialog-inner" :style="{ height: dialogHeight }">
      <div v-if="!askName" class="dialog-front">
        <div class="closeBtn">
          <v-icon text class="cancelIcon" @click="$emit('input', false)"
            >mdi-close</v-icon
          >
        </div>

        <section class="modalHeader mb-6">
          <h3>{{ title }}</h3>
          <p>
            {{
              showEmailForm
                ? 'Enter your your friend’s email address or copy the link below.'
                : subtitle
            }}
          </p>
          <v-img
            v-if="imagePath"
            :max-width="maxImageWidth"
            class="mx-auto modalTopImage mb-8 mt-8"
            contain
            :src="imagePath"
          ></v-img>
        </section>

        <div v-if="showEmailForm">
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
          <div class="text-center mt-4">
            <slider-dots :total="2" :step="0" />
          </div>
        </div>
        <div v-else>
          <div class="d-flex justify-space-around px-8 text-center">
            <a role="button" class="share-option-btn" @click="facebookShare">
              <img src="~assets/images/dialogs/share_facebook.svg" alt="" />
              <span class="d-block">Facebook</span>
            </a>
            <a role="button" class="share-option-btn" @click="twitterShare">
              <img src="~assets/images/dialogs/share_twitter.svg" alt="" />
              <span class="d-block">Twitter</span>
            </a>
            <a
              role="button"
              class="share-option-btn"
              @click="showEmailForm = true"
            >
              <img src="~assets/images/dialogs/share_email.svg" alt="" />
              <span class="d-block">Email</span>
            </a>
          </div>
          <div class="hr-or">
            <span>or</span>
          </div>
        </div>

        <div class="mt-4 text-center">
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
          <v-img
            v-if="imagePath"
            :max-width="maxImageWidth"
            class="mx-auto modalTopImage mb-8 mt-8"
            contain
            :src="imagePath"
          ></v-img>
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
          <p v-if="idea">
            This is the direct link to the idea: “{{ idea.title }}”
          </p>
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
    idea: { type: Object, required: true },
    title: { type: String, default: 'Share this Idea' },
    subtitle: {
      type: String,
      default: 'Select how you’d like to share this idea.'
    },
    imagePath: { type: String, default: '' },
    maxImageWidth: { type: Number, default: 180 },
    dialogHeight: { type: String, default: '340px' }
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
    copyToClipboard: false,
    showEmailForm: false
  }),

  computed: {
    ...mapGetters({
      initialName: 'userData/userName',
      isAuthenticated: 'userData/isAuthenticated'
    })
  },

  watch: {
    value(val) {
      if (!val) {
        this.showEmailForm = false
        this.copyToClipboard = false
      }
    }
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
      if (typeof location === 'undefined' || !this.idea) {
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
    },

    facebookShare() {
      const href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        this.getShareUrl()
      )}`
      this.windowPopup(href, 600, 400)
    },

    twitterShare() {
      const href = `https://twitter.com/intent/tweet/?text=${
        this.idea.title
      }&url=${encodeURIComponent(this.getShareUrl())}&via=dailyidea`
      this.windowPopup(href, 500, 300)
    },

    windowPopup(url, width, height) {
      // Calculate the position of the popup so
      // it’s centered on the screen.
      const left = screen.width / 2 - width / 2
      const top = screen.height / 2 - height / 2

      window.open(
        url,
        '',
        'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=' +
          width +
          ',height=' +
          height +
          ',top=' +
          top +
          ',left=' +
          left
      )
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

.share-option-btn {
  color: #4c4763;
}

.hr-or {
  position: relative;
  margin-top: 35px;
  margin-bottom: 30px;
  border-top: 1px solid rgba(76, 71, 99, 0.2);
  text-align: center;
  span {
    display: inline-block;
    left: 50%;
    margin-left: -22px;
    margin-top: -11px;
    position: absolute;
    background-color: white;
    padding: 0 15px;
    color: #4c4763;
    font-size: 14px;
  }
}
</style>
