<template>
  <div
    class="save-idea-bookmark"
    :class="{ liked: isLiked }"
    @click="toggleIdeaLiked"
  >
    <v-icon
      v-if="!isLiked && !isLoading"
      color="white"
      :class="{ hidden: isLiked, 'plus-icon': true }"
    >
      fa fa-plus flag-icon</v-icon
    >
    <v-icon v-if="isLoading" color="white"
      >fas fa-circle-notch fa-spin flag-icon</v-icon
    >
    <div class="save-idea-bookmark__inner-triangle"></div>
    <SaveIdeaWithoutLoginDialog
      :visible.sync="showSaveWithoutLoginDialog"
      @close="showSaveWithoutLoginDialog = false"
    ></SaveIdeaWithoutLoginDialog>
  </div>
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
.save-idea-bookmark {
  margin: 0 5px;
  cursor: pointer;
  text-align: center;
  /*padding-top: 34px;*/
  display: inline-block;
  width: 42px;
  height: 70px;
  vertical-align: top;
  background-color: #ebe7ed;
  &:hover {
    background-color: #e0dce2;
  }
  &.liked {
    background-color: #ffb92d;
    &:hover {
      background-color: rgba(255, 185, 45, 0.76);
    }
  }
  transition: background-color 0.5s ease;
  border-radius: 0 0 5px 5px;
  position: relative;
  /*<!--top: -10px;-->*/
  &__inner-triangle {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 0;

    border-left: 21px solid transparent;
    border-right: 21px solid transparent;
    border-bottom: 16px solid white;

    /*background-color: red;*/
  }
  .flag-icon {
    margin-top: 10px;
  }
  .plus-icon {
    opacity: 1;
    /*transition: opacity 0.1s ease;*/
    &.hidden {
      opacity: 0;
    }
  }
}
</style>
