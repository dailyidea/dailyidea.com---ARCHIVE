<template>
  <span>
    <v-btn small icon @click="toggleIdeaLiked">
      <v-icon v-if="isLoading">fas fa-circle-notch fa-spin</v-icon>
      <v-icon v-else-if="!isLoading && isLiked" class="liked"
        >mdi-bookmark</v-icon
      >
      <v-icon v-else>mdi-bookmark-plus-outline</v-icon>
    </v-btn>
    <simple-dialog-popup ref="simpleDialogPopup"></simple-dialog-popup>
    <on-un-auth-action-ask-email-dialog
      ref="onUnAuthActionAskEmailDialog"
    ></on-un-auth-action-ask-email-dialog>
    <on-un-auth-action-ask-name-dialog
      ref="onUnAuthActionAskNameDialog"
    ></on-un-auth-action-ask-name-dialog>
    <on-first-idea-saved-dialog
      ref="onFirstIdeaSavedDialog"
    ></on-first-idea-saved-dialog>
    <on-idea-saved-by-log-in-link-dialog
      ref="onIdeaSavedByLogInLinkDialog"
    ></on-idea-saved-by-log-in-link-dialog>
  </span>
</template>

<script>
import nanoid from 'nanoid'
import { graphqlOperation } from '@aws-amplify/api'
import getIsIdeaLikedByMe from '@/graphql/query/getIsIdeaLikedByMe'
import likeIdea from '@/graphql/mutations/likeIdea'
import unlikeIdea from '@/graphql/mutations/unlikeIdea'
import simpleDialogPopup from '@/components/dialogs/simpleDialogPopup'
import onFirstIdeaSavedDialog from '@/components/ideaDetail/onFirstIdeaSavedDialog'
import onIdeaSavedByLogInLinkDialog from '@/components/ideaDetail/onIdeaSavedByLogInLinkDialog'
import onUnAuthActionAskEmailDialog from '@/components/ideaDetail/onUnAuthActionAskEmailDialog'
import onUnAuthActionAskNameDialog from '@/components/ideaDetail/onUnAuthActionAskNameDialog'
import checkEmailBelongsToExistingUser from '@/graphql/query/checkEmailBelongsToExistingUser'

import setWasWelcomed from '@/graphql/mutations/setWasWelcomed'

export default {
  name: 'SaveIdeaBookmark',
  components: {
    onUnAuthActionAskEmailDialog,
    onUnAuthActionAskNameDialog,
    simpleDialogPopup,
    onFirstIdeaSavedDialog,
    onIdeaSavedByLogInLinkDialog
  },
  props: {},
  data() {
    return {
      isLiked: false,
      isLoading: false
    }
  },
  mounted() {
    this.initIdeaSaveState()
  },
  methods: {
    async initIdeaSaveState() {
      if (this.$route.query.aa) {
        const additionalAction = this.$route.query.aa
        if (additionalAction === 'si') {
          // save idea
          this.$router.replace({ query: null })
          await this.likeIdea()
          const wasWelcomed = this.$store.getters['userData/wasWelcomed']
          if (wasWelcomed) {
            this.$refs.onIdeaSavedByLogInLinkDialog.show(
              this.$store.getters['userData/userName']
            )
          } else {
            this.$refs.onFirstIdeaSavedDialog.show()
            this.$amplifyApi.graphql(
              graphqlOperation(setWasWelcomed, {
                userId: this.$store.getters['userData/userId']
              })
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
          ideaId: this.$route.params.ideaId,
          ideaOwnerId: this.$route.params.userId
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
          ideaId: this.$route.params.ideaId,
          ideaOwnerId: this.$route.params.userId
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
    toggleIdeaLikedAuth() {
      if (this.isLiked) {
        this.unLikeIdea()
      } else {
        this.likeIdea()
      }
    },
    checkEmailBelongsToExistingUser(email) {
      return this.$amplifyApi.graphql({
        query: checkEmailBelongsToExistingUser,
        variables: {
          email
        },
        authMode: 'API_KEY'
      })
    },

    async registerUserAndProcessSaveIdea(email, name, ideaToSaveId) {
      try {
        this.$store.commit('layoutState/showProgressBar')
        await this.$store.dispatch('cognito/registerUser', {
          username: email,
          password: nanoid(),
          attributes: {
            name
          }
        })
        await this.$amplifyApi.post('RequestLogin', '', {
          body: { email, ideaToSaveId }
        })
        this.$store.commit('layoutState/hideProgressBar')
        this.$refs.simpleDialogPopup.show(
          `Awesome, ${name}!`,
          "We just sent you an email, which we'll just use to make sure we can find your saved ideas later. Please check your inbox and click the link the confirmation link to finish saving this idea.",
          'OK',
          null
        )
        this.$store.commit('layoutState/hideProgressBar')
      } catch (e) {
        this.$store.commit('layoutState/hideProgressBar')
      }
    },

    async requestAuthAndProcessIdeaSaving(email, ideaToSaveId) {
      this.$store.commit('layoutState/showProgressBar')
      await this.$amplifyApi.post('RequestLogin', '', {
        body: { email, ideaToSaveId }
      })
      this.$store.commit('layoutState/hideProgressBar')
      this.$refs.simpleDialogPopup.show(
        'Welcome back!',
        "We sent you a confirmation email. Please check your inbox and click the verification link in the message so we can make sure we're saving this idea to the right account.",
        'ok',
        null
      )
    },

    async toggleIdeaLikedNotAuth() {
      try {
        let email = await this.$refs.onUnAuthActionAskEmailDialog.show(
          'Introduce yourself?',
          "What's your email address so you can find your saved ideas later? (Just so I know how to find this for you in the future.)",
          'ok',
          'cancel'
        )
        email = email.toLowerCase()
        this.$store.commit('layoutState/showProgressBar')
        const result = await this.checkEmailBelongsToExistingUser(email)
        const belongsToExistingUser =
          result.data.checkEmailBelongsToExistingUser.belongsToExistingUser
        this.$store.commit('layoutState/hideProgressBar')
        if (belongsToExistingUser) {
          this.requestAuthAndProcessIdeaSaving(email, this.$route.params.ideaId)
        } else {
          const name = await this.$refs.onUnAuthActionAskNameDialog.show(
            'Almost there',
            'What can we call you?',
            'ok',
            'cancel'
          )
          this.registerUserAndProcessSaveIdea(
            email,
            name,
            this.$route.params.ideaId
          )
        }
      } catch (e) {
        this.$store.commit('layoutState/hideProgressBar')
      }
    },
    toggleIdeaLiked() {
      if (this.isLoading) {
        return
      }
      if (this.$store.getters['cognito/isLoggedIn']) {
        this.toggleIdeaLikedAuth()
      } else {
        this.toggleIdeaLikedNotAuth()
      }
    },
    async getIsIdeaLikedByMe() {
      if (this.$store.getters['cognito/isLoggedIn']) {
        this.isLoading = true
        const res = await this.$amplifyApi.graphql({
          query: getIsIdeaLikedByMe,
          variables: {
            ideaId: this.$route.params.ideaId
          }
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
