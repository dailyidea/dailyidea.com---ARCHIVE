<template>
  <span>
    <like-idea
      v-if="action === 'like'"
      :is-liked="isActedOn"
      :is-loading="isLoading"
      :is-logged-in="isLoggedIn"
      @init-like-state="initIdeaState"
      @is-liked-by-me="handleIsIdeaLikedByMe"
      @show-ask-email="handleShowAskEmail"
      @like-idea="likeIdea"
      @unlike-idea="unlikeIdea"
    ></like-idea>
    <save-idea
      v-else
      :is-loading="isLoading"
      :is-saved="isActedOn"
      :is-logged-in="isLoggedIn"
      @init-save-state="initIdeaState"
      @is-saved-by-me="handleIsIdeaSavedByMe"
      @show-ask-email="handleShowAskEmail"
      @save-idea="saveIdea"
      @unsave-idea="unsaveIdea"
    ></save-idea>
    <ask-email-dialog
      v-model="showAskEmail"
      header="Introduce yourself?"
      message="What's your email address so you can find your saved ideas later?
                      (Just so I know how to find this for you in the future.)"
      @data="onNoAuthEmail"
    ></ask-email-dialog>

    <ask-name-dialog
      v-model="showAskName"
      header="Almost there"
      message="What can we call you?"
      @data="onNoAuthName"
    ></ask-name-dialog>

    <default-dialog
      v-model="showFirstIdeaSaved"
      header="Hooray!"
      :show-cancel-button="false"
      button-ok-text="I'm in!"
      @ok="() => (showFirstIdeaSaved = false)"
    >
      <p>
        You saved your first idea! Welcome to Daily idea. You can
        <router-link to="/ideas/all">browse more ideas</router-link> or
        <router-link to="/ideas/create"
          >start saving your own ideas</router-link
        >
        whenever you're ready.
      </p>
    </default-dialog>

    <default-dialog
      v-model="showSavedByLoginLink"
      header="Yay!"
      :show-cancel-button="false"
      button-ok-text="Nice!"
      @ok="() => (showSavedByLoginLink = false)"
    >
      <p>
        Welcome back {{ name }}. We saved that idea for you! You can check all
        your saved ideas on your
        <router-link to="/ideas/liked">Saved Ideas page</router-link>.
      </p>
    </default-dialog>
  </span>
</template>

<script>
import nanoid from 'nanoid'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { graphqlOperation } from '@aws-amplify/api'
import SaveIdea from './SaveIdea'
import LikeIdea from './LikeIdea'
import AskEmailDialog from './AskEmailDialog'
import DefaultDialog from '@/components/dialogs/DefaultDialog'
import checkEmailBelongsToExistingUser from '@/graphql/query/checkEmailBelongsToExistingUser'
import setWasWelcomed from '@/graphql/mutations/setWasWelcomed'
import AskNameDialog from '@/components/ideaDetail/AskNameDialog'

export default {
  name: 'ActOnIdea',

  components: {
    DefaultDialog,
    AskEmailDialog,
    AskNameDialog,
    LikeIdea,
    SaveIdea
  },

  props: {
    action: {
      type: String,
      required: true,
      validator: val => ['like', 'save'].includes(val)
    }
  },

  data() {
    return {
      isActedOn: false,
      isLoading: false,

      showAskEmail: false,
      email: '',

      showAskName: false,
      name: '',

      showFirstIdeaSaved: false,
      showSavedByLoginLink: false
    }
  },

  computed: {
    ...mapGetters({
      isLoggedIn: 'cognito/isLoggedIn',
      userWasWelcomed: 'userData/wasWelcomed',
      userName: 'userData/userName',
      userId: 'userData/userId'
    })
  },

  methods: {
    ...mapMutations({
      showProgressBar: 'layoutState/showProgressBar',
      hideProgressBar: 'layoutState/hideProgressBar'
    }),

    ...mapActions({
      registerUser: 'cognito/registerUser'
    }),

    async initIdeaState(mutation) {
      if (this.$route.query.aa) {
        const additionalAction = this.$route.query.aa
        if (additionalAction === 'si') {
          // save or like idea depending on action prop
          this.$router.replace({ query: null })
          await this.doIdeaAction(mutation)
          if (this.userWasWelcomed) {
            this.showSavedByLoginLink = true
          } else {
            this.showFirstIdeaSaved = true
            this.$amplifyApi.graphql(
              graphqlOperation(setWasWelcomed, { userId: this.userId })
            )
          }
        }
      }
    },

    emitLikeStateChange(result) {
      this.$emit('liked-state-changed', {
        liked: this.isActedOn,
        likesCount: result.likesCount
      })
    },

    emitSaveStateChange(result) {
      this.$emit('saved-state-changed', {
        saved: this.isActedOn,
        savesCount: result.savesCount
      })
    },

    async saveIdea(mutation) {
      const res = await this.doIdeaAction(mutation)
      const result = res.data.saveIdea
      this.emitSaveStateChange(result)
    },

    async unsaveIdea(mutation) {
      const res = await this.undoIdeaAction(mutation)
      const result = res.data.unsaveIdea
      this.emitSaveStateChange(result)
    },

    async likeIdea(mutation) {
      const res = await this.doIdeaAction(mutation)
      const result = res.data.likeIdea
      this.emitLikeStateChange(result)
    },

    async unlikeIdea(mutation) {
      const res = await this.undoIdeaAction(mutation)
      const result = res.data.unlikeIdea
      this.emitLikeStateChange(result)
    },

    async doIdeaAction(mutation) {
      this.isLoading = true
      const res = await this.$amplifyApi.graphql({
        query: mutation,
        variables: {
          ideaId: this.$route.params.ideaId,
          ideaOwnerId: this.$route.params.userId
        }
      })
      this.isActedOn = true
      this.isLoading = false
      return res
    },

    async undoIdeaAction(mutation) {
      this.isLoading = true
      const res = await this.$amplifyApi.graphql({
        query: mutation,
        variables: {
          ideaId: this.$route.params.ideaId,
          ideaOwnerId: this.$route.params.userId
        }
      })

      this.isActedOn = false
      this.isLoading = false
      return res
    },

    checkEmailBelongsToExistingUser(email) {
      return this.$amplifyApi.graphql({
        query: checkEmailBelongsToExistingUser,
        variables: { email },
        authMode: 'API_KEY'
      })
    },

    async registerUserAndProcessSaveIdea() {
      await this.registerUser({
        username: this.email,
        password: nanoid(),
        attributes: { name: this.name }
      })
      await this.$amplifyApi.post('RequestLogin', '', {
        body: { email: this.email, ideaToSaveId: this.$route.params.ideaId }
      })
      this.$dialog.show({
        header: `Awesome, ${this.name}!`,
        message: `We just sent you an email, which we'll just use to make sure we can find your saved
        ideas later. Please check your inbox and click the link the confirmation link to finish saving this idea.`
      })
    },

    async requestAuthAndProcessIdeaSaving(email, ideaToSaveId) {
      this.showProgressBar()
      await this.$amplifyApi.post('RequestLogin', '', {
        body: { email, ideaToSaveId }
      })
      this.$dialog.show({
        header: 'Welcome back!',
        message: `We sent you a confirmation email. Please check your inbox and click the
        verification link in the message so we can make sure we're saving this
        idea to the right account.`
      })
      this.hideProgressBar()
    },

    async onNoAuthEmail(email) {
      this.email = email.toLowerCase()
      this.showAskEmail = false
      this.showProgressBar()
      try {
        const result = await this.checkEmailBelongsToExistingUser(this.email)
        const {
          belongsToExistingUser
        } = result.data.checkEmailBelongsToExistingUser
        this.hideProgressBar()

        if (belongsToExistingUser) {
          this.requestAuthAndProcessIdeaSaving(
            this.email,
            this.$route.params.ideaId
          )
        } else {
          this.showAskName = true
        }
      } catch (e) {
        this.hideProgressBar()
      }
    },

    handleShowAskEmail() {
      this.showAskEmail = true
    },

    async handleIsIdeaSavedByMe(query) {
      const res = await this.getIsIdeaActedOnByMe(query)
      const result = res.data.getIsIdeaSavedByMe
      if (result.result.ok) {
        this.isActedOn = result.isSaved
      }
    },

    async handleIsIdeaLikedByMe(query) {
      const res = await this.getIsIdeaActedOnByMe(query)
      const result = res.data.getIsIdeaLikedByMe
      if (result.result.ok) {
        this.isActedOn = result.isLiked
      }
    },

    async getIsIdeaActedOnByMe(query) {
      if (this.isLoggedIn) {
        this.isLoading = true
        const res = await this.$amplifyApi.graphql({
          query,
          variables: {
            ideaId: this.$route.params.ideaId
          }
        })

        this.isLoading = false

        return res
      }
    },

    async onNoAuthName(name) {
      this.name = name
      this.showAskName = false
      this.showProgressBar()
      await this.registerUserAndProcessSaveIdea()
      this.hideProgressBar()
    }
  }
}
</script>

<style scoped lang="scss">
.action-button {
  color: #ffb92d !important;
  &:hover {
    color: rgba(255, 185, 45, 0.76) !important;
  }
}
</style>
