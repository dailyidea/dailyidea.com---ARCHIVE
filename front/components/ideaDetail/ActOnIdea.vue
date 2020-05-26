<template>
  <span>
    <v-btn small icon @click="toggleIdeaAction">
      <v-icon v-if="isLoading">fas fa-circle-notch fa-spin</v-icon>
      <v-icon v-else-if="!isLoading && isActedOn" class="action-button"
      >{{ iconFilled }}</v-icon>
      <v-icon v-else>{{ iconOutlined }}</v-icon>
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
import getIsIdeaSavedByMe from '@/graphql/query/getIsIdeaSavedByMe'
import likeIdea from '@/graphql/mutations/likeIdea'
import unlikeIdea from '@/graphql/mutations/unlikeIdea'
import saveIdea from '@/graphql/mutations/saveIdea'
import unsaveIdea from '@/graphql/mutations/unsaveIdea'
import simpleDialogPopup from '@/components/dialogs/simpleDialogPopup'
import onFirstIdeaSavedDialog from '@/components/ideaDetail/onFirstIdeaSavedDialog'
import onIdeaSavedByLogInLinkDialog from '@/components/ideaDetail/onIdeaSavedByLogInLinkDialog'
import onUnAuthActionAskEmailDialog from '@/components/ideaDetail/onUnAuthActionAskEmailDialog'
import onUnAuthActionAskNameDialog from '@/components/ideaDetail/onUnAuthActionAskNameDialog'
import checkEmailBelongsToExistingUser from '@/graphql/query/checkEmailBelongsToExistingUser'

import setWasWelcomed from '@/graphql/mutations/setWasWelcomed'

export default {
  name: 'ActOnIdea',
  components: {
    onUnAuthActionAskEmailDialog,
    onUnAuthActionAskNameDialog,
    simpleDialogPopup,
    onFirstIdeaSavedDialog,
    onIdeaSavedByLogInLinkDialog
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
      isLoading: false
    }
  },

  computed: {
    iconFilled() {
      return this.action === 'like' ? 'mdi-thumb-up' : 'mdi-bookmark-plus' 
    },

    iconOutlined() {
      return this.action === 'like' ? 'mdi-thumb-up-outline' : 'mdi-bookmark-plus-outline'
    },

    isActedOnQuery() {
      return this.action === 'like' ? getIsIdeaLikedByMe : getIsIdeaSavedByMe
    },

    doMutation() {
      return this.action === 'like' ? likeIdea : saveIdea
    },

    undoMutation() {
      return this.action === 'like' ? unlikeIdea : unsaveIdea
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
          // save or like idea depending on action prop
          this.$router.replace({ query: null })
          await this.doIdeaAction()
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
        this.getIsIdeaActedOnByMe()
      }
    },

    emitStateChange(result) {
      if(this.action === 'like') {
        this.$emit('likedStateChanged', {
          liked: this.isActedOn,
          likesCount: result.likesCount
        })
      } else {
        this.$emit('savedStateChanged', {
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
      const result = this.action === 'like' ? res.data.likeIdea : res.data.saveIdea
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
      const result = this.idea === 'like' ? res.data.unlikeIdea : res.data.unsaveIdea
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

    async toggleIdeaNotAuth() {
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
    toggleIdeaAction() {
      if (this.isLoading) {
        return
      }
      if (this.$store.getters['cognito/isLoggedIn']) {
        this.toggleIdeaAuth()
      } else {
        this.toggleIdeaNotAuth()
      }
    },
    async getIsIdeaActedOnByMe() {
      if (this.$store.getters['cognito/isLoggedIn']) {
        this.isLoading = true
        const res = await this.$amplifyApi.graphql({
          query: this.isActedOnQuery,
          variables: {
            ideaId: this.$route.params.ideaId
          }
        })

        const result = this.action === 'like' ? res.data.getIsIdeaLikedByMe : res.data.getIsIdeaSavedByMe
        if (result.result.ok) {
          this.isActedOn = this.action === 'like' ? result.isLiked : result.isSaved
        }
        this.isLoading = false
      }
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
