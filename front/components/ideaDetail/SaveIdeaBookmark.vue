<template>
  <span>
    <v-btn small icon @click="toggleIdeaLiked">
      <v-icon v-if="isLoading">fas fa-circle-notch fa-spin</v-icon>
      <v-icon v-else-if="!isLoading && isLiked" class="liked"
        >mdi-bookmark</v-icon
      >
      <v-icon v-else>mdi-bookmark-plus-outline</v-icon>
    </v-btn>
    <SaveIdeaWithoutLoginDialog
      :visible.sync="showSaveWithoutLoginDialog"
      @close="showSaveWithoutLoginDialog = false"
    ></SaveIdeaWithoutLoginDialog>
  </span>
</template>

<script>
import getIsIdeaLikedByMe from '@/graphql/query/getIsIdeaLikedByMe'
import likeIdea from '@/graphql/mutations/likeIdea'
import unlikeIdea from '@/graphql/mutations/unlikeIdea'
import SaveIdeaWithoutLoginDialog from '@/components/dialogs/saveIdeaWithoutLogin'

export default {
  name: 'SaveIdeaBookmark',
  components: { SaveIdeaWithoutLoginDialog },
  props: {},
  data() {
    return {
      showSaveWithoutLoginDialog: false,
      isLiked: false,
      isLoading: false
    }
  },
  created() {
    this.getIsIdeaLikedByMe()
  },
  methods: {
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
    toggleIdeaLikedNotAuth() {
      this.showSaveWithoutLoginDialog = true
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
