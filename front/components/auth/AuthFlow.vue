<template>
  <div>
    <ask-email-dialog
      :loading="loading"
      :value="showAskEmail"
      :header="askEmailHeader"
      :message="askEmailMessage"
      :show-close-button="showCloseButton"
      :persistent="persistent"
      :button-cancel-text="buttonCancelText"
      @input="$emit('input', false)"
      @cancel="$emit('cancel')"
      @data="onEmailEntered"
    ></ask-email-dialog>

    <ask-name-dialog
      v-model="showAskName"
      :loading="loading"
      :show-close-button="showCloseButton"
      :persistent="persistent"
      header="Welcome to Daily Idea!"
      :message="
        `“Anonymous user” just doesn’t feel so personal... Enter your name to finish ${actionGerund} this idea.`
      "
      @data="onNameEntered"
    ></ask-name-dialog>

    <welcome-dialog
      v-model="showWelcome"
      :action="action"
      :name="name"
      :email="email"
      :message="welcomeMessage"
      :show-close-button="showCloseButton"
      :persistent="persistent"
      @resend="onResend"
    />

    <resend-email-dialog
      v-model="showResend"
      :loading="loading"
      :email="email"
      :show-close-button="showCloseButton"
      :persistent="persistent"
      @resend="onResend"
    />
  </div>
</template>

<script>
import nanoid from 'nanoid'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import AskEmailDialog from '../dialogs/AskEmailDialog'
import AskNameDialog from '../dialogs/AskNameDialog'
import checkEmailBelongsToExistingUser from '@/graphql/query/checkEmailBelongsToExistingUser'
import WelcomeDialog from '@/components/dialogs/WelcomeDialog'
import ResendEmailDialog from '@/components/dialogs/ResendEmailDialog'

export default {
  components: {
    ResendEmailDialog,
    WelcomeDialog,
    AskEmailDialog,
    AskNameDialog
  },

  props: {
    value: Boolean,
    action: {
      type: String,
      required: true,
      validator: val =>
        ['like', 'save', 'comment', 'share', 'post'].includes(val)
    },
    idea: { type: Object, default: null },
    comment: { type: Object, default: null },
    userIdCallback: { type: Function, default: null },
    next: { type: String, default: '' },
    showCloseButton: { type: Boolean, default: true },
    persistent: { type: Boolean, default: false },
    buttonCancelText: { type: String, default: 'Cancel' }
  },

  data() {
    return {
      email: '',
      loading: false,
      name: '',
      showAskEmail: false,
      showAskName: false,
      showWelcome: false,
      newUser: false,
      showResend: false,
      tmpUserId: null
    }
  },

  computed: {
    ...mapGetters({
      isLoggedIn: 'cognito/isLoggedIn',
      userWasWelcomed: 'userData/wasWelcomed',
      userName: 'userData/userName',
      userId: 'userData/userId'
    }),

    isGmail() {
      return this.email && this.email.match(/gmail.com$/i)
    },

    actionGerund() {
      switch (this.action) {
        case 'like':
          return 'liking'
        case 'save':
          return 'saving'
        default:
          return 'commenting'
      }
    },

    askEmailHeader() {
      if (this.action === 'post') {
        return 'We can’t wait to see your idea!'
      }

      if (this.action === 'share') {
        return 'Become an Idea Machine'
      }

      return 'What’s your email?'
    },

    askEmailMessage() {
      switch (this.action) {
        case 'like':
        case 'save':
        case 'comment':
          return `Enter your email address to finish <span class='link-highlight'>${this.actionGerund}</span> this idea.`
        case 'post':
          return 'Enter your email address to get started!'
        case 'share':
          return 'Subscribe to the best ideas on the internet, delivered weekly.<br> Enter your email below to get sign up or log in.'
        default:
          return 'Enter your email address.'
      }
    },

    welcomeMessage() {
      if (this.action === 'post') {
        return 'Click the verification link in your inbox to start writing your post.'
      }
      if (this.action === 'share') {
        return this.isGmail
          ? `We’ve sent you an authentication email, please click the button inside to log in.`
          : `Click the verification link in your inbox to log in.`
      }

      return this.isGmail
        ? `Click the verification link in your inbox to finish <span class='link-highlight'>${this.actionGerund}</span> this idea.`
        : `We’ve sent you an authentication email, please click the button inside to log in and finish <span class='link-highlight'>${this.actionGerund}</span> this idea.`
    }
  },

  watch: {
    value(val) {
      if (val) {
        this.showAskEmail = true
      } else {
        this.showAskEmail = false
        this.showAskName = false
        this.showWelcome = false
      }
    }
  },

  methods: {
    ...mapMutations({
      showProgressBar: 'layoutState/showProgressBar',
      hideProgressBar: 'layoutState/hideProgressBar'
    }),

    ...mapActions({ registerUser: 'cognito/registerUser' }),

    async checkEmailExists() {
      const res = await this.$amplifyApi.graphql({
        query: checkEmailBelongsToExistingUser,
        variables: { email: this.email },
        authMode: 'API_KEY'
      })

      return res.data.checkEmailBelongsToExistingUser
    },

    async requestAuth() {
      const data = { email: this.email }

      if (['like', 'save'].includes(this.action)) {
        const key = this.action === 'save' ? 'ideaToSaveId' : 'ideaToLikeId'
        data[key] = this.idea.ideaId
      }
      if (this.action === 'comment') {
        data.commentId = this.comment.commentId
      }

      if (!this.showResend) {
        this.showWelcome = true
        this.$emit('input', false)
      }

      if (this.next) {
        data.next = this.next
      }

      await this.$amplifyApi.post('RequestLogin', '', {
        body: data
      })
    },

    async onNameEntered(name) {
      this.loading = true
      try {
        const user = await this.registerUser({
          username: this.email,
          password: nanoid(),
          attributes: { name }
        })
        this.tmpUserId = user.userSub

        // This is an edge case when some action has to be done after
        // userId is aquired but before login link request
        if (this.userIdCallback) {
          await this.userIdCallback(this.tmpUserId)
        }
        await this.requestAuth()
        this.showAskName = false
        this.$emit('email-sent')
      } catch (e) {
        console.error(e) // eslint-disable-line
        this.$sentry.captureException(e)
      }
      this.loading = false
    },

    async onEmailEntered(email) {
      this.email = email.toLowerCase()
      this.loading = true

      try {
        const exists = await this.checkEmailExists()

        if (exists.belongsToExistingUser) {
          this.name = exists.name
          this.tmpUserId = exists.userId

          // This is an edge case when some action has to be done after
          // userId is aquired but before login link request
          if (this.userIdCallback) {
            await this.userIdCallback(this.tmpUserId)
          }
          await this.requestAuth()
          this.$emit('email-sent')
        } else {
          this.newUser = true
          this.showAskName = true
        }
        this.showAskEmail = false
      } catch (e) {
        console.error(e) // eslint-disable-line
        this.$sentry.captureException(e)
      }
      this.loading = false
    },

    async onResend() {
      this.showResend = true
      this.showWelcome = false
      this.loading = true
      try {
        await this.requestAuth()
      } catch (e) {
        console.error(e) // eslint-disable-line
        this.$sentry.captureException(e)
      }
      this.loading = false
    }
  }
}
</script>
