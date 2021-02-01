<template>
  <div>
    <ask-email-dialog
      :loading="loading"
      :value="showAskEmail"
      :message="
        `Enter your email address to finish <span class='link-highlight'>${actionGerund}</span> this idea.`
      "
      @input="$emit('input', false)"
      @cancel="$emit('cancel')"
      @data="onEmailEntered"
    ></ask-email-dialog>

    <ask-name-dialog
      v-model="showAskName"
      :loading="loading"
      header="Welcome to Daily Idea!"
      :message="
        `“Anonymous user” just doesn’t feel so personal... Enter your name to finish ${actionGerund} this idea.`
      "
      @data="onNameEntered"
    ></ask-name-dialog>

    <welcome-dialog
      v-model="showWelcome"
      :name="name"
      :email="email"
      :message="
        isGmail
          ? `Click the verification link in your inbox to finish <span class='link-highlight'>${actionGerund}</span> this idea.`
          : `We’ve sent you an authentication email, please click the button inside to log in and finish <span class='link-highlight'>${actionGerund}</span> this idea.`
      "
      @resend="onResend"
    />

    <resend-email-dialog
      v-model="showResend"
      :loading="loading"
      :email="email"
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
      validator: val => ['like', 'save', 'comment'].includes(val)
    },
    idea: { type: Object, required: true },
    comment: { type: Object, default: null },
    userIdCallback: { type: Function, default: null }
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
    }
  },

  watch: {
    value(val) {
      if (val) {
        this.showAskEmail = true
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
