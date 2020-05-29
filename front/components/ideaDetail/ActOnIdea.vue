<template>
  <span>
    <v-btn small icon @click="toggleIdeaAction">
      <v-icon v-if="isLoading">fas fa-circle-notch fa-spin</v-icon>
      <v-icon v-else-if="!isLoading && isActedOn" class="action-button">{{
        iconFilled
      }}</v-icon>
      <v-icon v-else>{{ iconOutlined }}</v-icon>
    </v-btn>

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
import getIsIdeaLikedByMe from '@/graphql/query/getIsIdeaLikedByMe'
import getIsIdeaSavedByMe from '@/graphql/query/getIsIdeaSavedByMe'
import likeIdea from '@/graphql/mutations/likeIdea'
import unlikeIdea from '@/graphql/mutations/unlikeIdea'
import saveIdea from '@/graphql/mutations/saveIdea'
import unsaveIdea from '@/graphql/mutations/unsaveIdea'
import DefaultDialog from '@/components/dialogs/DefaultDialog'
import checkEmailBelongsToExistingUser from '@/graphql/query/checkEmailBelongsToExistingUser'
import setWasWelcomed from '@/graphql/mutations/setWasWelcomed'
import AskNameDialog from '@/components/ideaDetail/AskNameDialog'
import AskEmailDialog from './AskEmailDialog'
export default {
  name: 'ActOnIdea',

  components: {
    DefaultDialog,
    AskEmailDialog,
    AskNameDialog
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
    iconFilled() {
      return this.action === 'like' ? 'mdi-thumb-up' : 'mdi-bookmark-plus'
    },

    iconOutlined() {
      return this.action === 'like'
        ? 'mdi-thumb-up-outline'
        : 'mdi-bookmark-plus-outline'
    },

    isActedOnQuery() {
      return this.action === 'like' ? getIsIdeaLikedByMe : getIsIdeaSavedByMe
    },

    doMutation() {
      return this.action === 'like' ? likeIdea : saveIdea
    },

    undoMutation() {
      return this.action === 'like' ? unlikeIdea : unsaveIdea
    },

    ...mapGetters({
      isLoggedIn: 'cognito/isLoggedIn',
      userWasWelcomed: 'userData/wasWelcomed',
      userName: 'userData/userName',
      userId: 'userData/userId'
    })
  },

  mounted() {
    this.initIdeaSaveState()
  },

  methods: {
    ...mapMutations({
      showProgressBar: 'layoutState/showProgressBar',
      hideProgressBar: 'layoutState/hideProgressBar'
    }),

    ...mapActions({
      registerUser: 'cognito/registerUser'
    }),

    async initIdeaSaveState() {
      if (this.$route.query.aa) {
        const additionalAction = this.$route.query.aa
        if (additionalAction === 'si') {
          // save or like idea depending on action prop
          this.$router.replace({ query: null })
          await this.doIdeaAction()
          if (this.userWasWelcomed) {
            this.showSavedByLoginLink = true
          } else {
            this.showFirstIdeaSaved = true
            this.$amplifyApi.graphql(
              graphqlOperation(setWasWelcomed, { userId: this.userId })
            )
          }
        }
      } else {
        this.getIsIdeaActedOnByMe()
      }
    },

    emitStateChange(result) {
      if (this.action === 'like') {
        this.$emit('liked-state-changed', {
          liked: this.isActedOn,
          likesCount: result.likesCount
        })
      } else {
        this.$emit('saved-state-changed', {
          saved: this.isActedOn,
          savesCount: result.savesCount
        })
      }
    },

    async doIdeaAction() {
      this.isLoading = true
      const res = await this.$amplifyApi.graphql({
        query: this.doMutation,
        variables: {
          ideaId: this.$route.params.ideaId,
          ideaOwnerId: this.$route.params.userId
        }
      })
      const result =
        this.action === 'like' ? res.data.likeIdea : res.data.saveIdea
      this.isActedOn = true
      this.isLoading = false
      this.emitStateChange(result)
      return res
    },
    async undoIdeaAction() {
      this.isLoading = true
      const res = await this.$amplifyApi.graphql({
        query: this.undoMutation,
        variables: {
          ideaId: this.$route.params.ideaId,
          ideaOwnerId: this.$route.params.userId
        }
      })

      const result =
        this.action === 'like' ? res.data.unlikeIdea : res.data.unsaveIdea
      this.isActedOn = false
      this.isLoading = false
      this.emitStateChange(result)
    },

    toggleIdeaAuth() {
      if (this.isActedOn) {
        this.undoIdeaAction()
      } else {
        this.doIdeaAction()
      }
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

    toggleIdeaAction() {
      if (this.isLoading) {
        return
      }
      if (this.isLoggedIn) {
        this.toggleIdeaAuth()
      } else {
        this.showAskEmail = true;
      }
    },
    async getIsIdeaActedOnByMe() {
      if (this.isLoggedIn) {
        this.isLoading = true
        const res = await this.$amplifyApi.graphql({
          query: this.isActedOnQuery,
          variables: {
            ideaId: this.$route.params.ideaId
          }
        })

        const result =
          this.action === 'like'
            ? res.data.getIsIdeaLikedByMe
            : res.data.getIsIdeaSavedByMe
        if (result.result.ok) {
          this.isActedOn =
            this.action === 'like' ? result.isLiked : result.isSaved
        }
        this.isLoading = false
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
