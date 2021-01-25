<template>
  <span>
    <auth-flow v-model="showAuth" :idea="idea" :action="action" />

    <like-idea
      v-if="action === 'like'"
      :is-liked="isActedOn"
      :is-loading="isLoading"
      :is-logged-in="isLoggedIn"
      :idea="idea"
      @is-liked-by-me="handleIsIdeaLikedByMe"
      @show-auth="showAuth = true"
      @like-idea="likeIdea"
      @unlike-idea="unlikeIdea"
    ></like-idea>

    <save-idea
      v-else
      :is-loading="isLoading"
      :is-saved="isActedOn"
      :is-logged-in="isLoggedIn"
      :idea="idea"
      @is-saved-by-me="handleIsIdeaSavedByMe"
      @show-auth="showAuth = true"
      @save-idea="saveIdea"
      @unsave-idea="unsaveIdea"
    ></save-idea>

    <default-dialog
      v-model="showFirstIdeaSaved"
      header="Hooray!"
      :show-cancel-button="false"
      button-ok-text="I'm in!"
      @ok="showFirstIdeaSaved = false"
    >
      <p>
        You saved your first idea! All your saved ideas will be available in
        your account from now on.
      </p>
      <p>
        Do you want to:<br />
        <a href="#" @click.prevent="showFirstIdeaSaved = false"
          >go back to the idea you saved</a
        >,<br />
        <router-link to="/ideas-cards">browse other ideas</router-link>,<br />
        <router-link to="/ideas/create"
          >start entering your own great ideas</router-link
        >?
      </p>
    </default-dialog>

    <default-dialog
      v-model="showFirstIdeaLiked"
      header="Hooray!"
      :show-cancel-button="false"
      button-ok-text="I'm in!"
      @ok="showFirstIdeaLiked = false"
    >
      <p>
        You liked your first idea!
      </p>
      <p>
        Do you want to:<br />
        <a href="#" @click.prevent="showFirstIdeaLiked = false"
          >go back to the idea you liked</a
        >,<br />
        <router-link to="/ideas-cards">browse other ideas</router-link>,<br />
        <router-link to="/ideas/create"
          >start entering your own great ideas</router-link
        >?
      </p>
    </default-dialog>

    <default-dialog
      v-model="showSavedByLoginLink"
      header="Yay!"
      :show-cancel-button="false"
      button-ok-text="Nice!"
      @ok="showSavedByLoginLink = false"
    >
      <p>
        Welcome back {{ userName }}. We saved that idea for you! You can check
        all your saved ideas on your
        <router-link to="/ideas/liked">Saved Ideas page</router-link>.
      </p>
    </default-dialog>

    <default-dialog
      v-model="showLikedByLoginLink"
      header="Yay!"
      :show-cancel-button="false"
      button-ok-text="Nice!"
      @ok="showLikedByLoginLink = false"
    >
      <p>
        Welcome back {{ userName }}. We liked that idea for you! You can check
        out more ideas <a href="/ideas-cards">here</a>.
      </p>
    </default-dialog>
  </span>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { graphqlOperation } from '@aws-amplify/api'
import LikeIdea from './LikeIdea'
import SaveIdea from './SaveIdea'
import DefaultDialog from '@/components/dialogs/DefaultDialog'
import setWasWelcomed from '@/graphql/mutations/setWasWelcomed'
import likeIdeaMutation from '@/graphql/mutations/likeIdea'
import saveIdeaMutation from '@/graphql/mutations/saveIdea'
import AuthFlow from '@/components/auth/AuthFlow'

export default {
  components: {
    AuthFlow,
    DefaultDialog,
    LikeIdea,
    SaveIdea
  },

  props: {
    action: {
      type: String,
      required: true,
      validator: val => ['like', 'save'].includes(val)
    },
    idea: { type: Object, required: true }
  },

  data() {
    return {
      isActedOn: false,
      isLoading: false,
      showAuth: false,

      showFirstIdeaSaved: false,
      showFirstIdeaLiked: false,
      showSavedByLoginLink: false,
      showLikedByLoginLink: false
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
    this.initIdeaState()
  },

  methods: {
    ...mapMutations({
      showProgressBar: 'layoutState/showProgressBar',
      hideProgressBar: 'layoutState/hideProgressBar'
    }),

    ...mapActions({ registerUser: 'cognito/registerUser' }),

    async initIdeaState() {
      if (this.$route.query.aa) {
        const additionalAction = this.$route.query.aa
        if (additionalAction) {
          this.$router.replace({ query: null })
          if (additionalAction === 'si' && this.action === 'save') {
            const res = await this.doIdeaAction(saveIdeaMutation)
            this.emitSaveStateChange(res.data.saveIdea)
          } else if (additionalAction === 'li' && this.action === 'like') {
            const res = await this.doIdeaAction(likeIdeaMutation)
            this.emitLikeStateChange(res.data.likeIdea)
          }
          if (this.userWasWelcomed) {
            if (this.action === 'save' && additionalAction === 'si') {
              this.showSavedByLoginLink = true
            } else if (this.action === 'like' && additionalAction === 'li') {
              this.showLikedByLoginLink = true
            }
          } else {
            if (this.action === 'save' && additionalAction === 'si') {
              this.showFirstIdeaSaved = true
            } else if (this.action === 'like' && additionalAction === 'li') {
              this.showFirstIdeaLiked = true
            }
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
      this.emitSaveStateChange(res.data.saveIdea)
    },

    async unsaveIdea(mutation) {
      const res = await this.undoIdeaAction(mutation)
      this.emitSaveStateChange(res.data.unsaveIdea)
    },

    async likeIdea(mutation) {
      const res = await this.doIdeaAction(mutation)
      this.emitLikeStateChange(res.data.likeIdea)
    },

    async unlikeIdea(mutation) {
      const res = await this.undoIdeaAction(mutation)
      this.emitLikeStateChange(res.data.unlikeIdea)
    },

    async doIdeaAction(mutation) {
      this.isLoading = true
      const res = await this.$amplifyApi.graphql({
        query: mutation,
        variables: { ideaId: this.idea.ideaId, ideaOwnerId: this.idea.userId }
      })
      this.isActedOn = true
      this.isLoading = false
      return res
    },

    async undoIdeaAction(mutation) {
      this.isLoading = true
      const res = await this.$amplifyApi.graphql({
        query: mutation,
        variables: { ideaId: this.idea.ideaId, ideaOwnerId: this.idea.userId }
      })

      this.isActedOn = false
      this.isLoading = false
      return res
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
          variables: { ideaId: this.idea.ideaId }
        })

        this.isLoading = false

        return res
      }
    }

    // async onNoAuthName(name) {
    //   this.name = name
    //   this.showAskName = false
    //   this.showProgressBar()
    //   await this.registerUserAndProcessIdeaAction()
    //   this.hideProgressBar()
    // }
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
