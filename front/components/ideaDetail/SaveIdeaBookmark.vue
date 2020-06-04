<template>
  <span>
    <v-btn small icon @click="toggleBookmark">
      <v-icon v-if="isLoading">fas fa-circle-notch fa-spin</v-icon>
      <v-icon v-else-if="!isLoading && isLiked" class="liked"
        >mdi-bookmark</v-icon
      >
      <v-icon v-else>mdi-bookmark-plus-outline</v-icon>
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
import AskEmailDialog from './AskEmailDialog'
import getIsIdeaLikedByMe from '@/graphql/query/getIsIdeaLikedByMe'
import likeIdea from '@/graphql/mutations/likeIdea'
import unlikeIdea from '@/graphql/mutations/unlikeIdea'
import DefaultDialog from '@/components/dialogs/DefaultDialog'
import checkEmailBelongsToExistingUser from '@/graphql/query/checkEmailBelongsToExistingUser'
import setWasWelcomed from '@/graphql/mutations/setWasWelcomed'
import AskNameDialog from '@/components/ideaDetail/AskNameDialog'

export default {
  name: 'SaveIdeaBookmark',

  components: {
    DefaultDialog,
    AskEmailDialog,
    AskNameDialog
  },

  props: {
    idea: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      isLiked: false,
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
          // save idea
          this.$router.replace({ query: null })
          await this.likeIdea()
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
        this.getIsIdeaLikedByMe()
      }
    },

    async likeIdea() {
      this.isLoading = true
      const res = await this.$amplifyApi.graphql({
        query: likeIdea,
        variables: {
          ideaId: this.idea.ideaId,
          ideaOwnerId: this.idea.userId
        }
      })
      const result = res.data.likeIdea
      this.isLiked = true
      this.isLoading = false
      this.$emit('savedStateChanged', {
        liked: true,
        likesCount: result.likesCount
      })
      return res
    },

    async unLikeIdea() {
      this.isLoading = true
      const res = await this.$amplifyApi.graphql({
        query: unlikeIdea,
        variables: {
          ideaId: this.idea.ideaId,
          ideaOwnerId: this.idea.userId
        }
      })
      const result = res.data.unlikeIdea
      this.isLiked = false
      this.isLoading = false
      this.$emit('savedStateChanged', {
        liked: false,
        likesCount: result.likesCount
      })
    },

    toggleBookmarkAuth() {
      if (this.isLiked) {
        this.unLikeIdea()
      } else {
        this.likeIdea()
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

    async onNoAuthName(name) {
      this.name = name
      this.showAskName = false
      this.showProgressBar()
      await this.registerUserAndProcessSaveIdea()
      this.hideProgressBar()
    },

    toggleBookmark() {
      if (this.isLoading) {
        return
      }

      if (this.isLoggedIn) {
        this.toggleBookmarkAuth()
      } else {
        this.showAskEmail = true
      }
    },

    async getIsIdeaLikedByMe() {
      if (this.isLoggedIn) {
        this.isLoading = true
        const res = await this.$amplifyApi.graphql({
          query: getIsIdeaLikedByMe,
          variables: { ideaId: this.$route.params.ideaId }
        })
        const result = res.data.getIsIdeaLikedByMe
        if (result.result.ok) {
          this.isLiked = result.isLiked
        }
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.liked {
  color: #ffb92d !important;
  &:hover {
    color: rgba(255, 185, 45, 0.76) !important;
  }
}
</style>
