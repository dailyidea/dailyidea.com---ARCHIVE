<template>
  <span>
    <v-btn small icon @click="toggleIsLiked">
      <v-icon v-if="isLoading">fas fa-circle-notch fa-spin</v-icon>
      <v-icon v-else-if="!isLoading && isLiked" class="action-button">
        mdi-thumb-up
      </v-icon>
      <v-icon v-else>mdi-thumb-up-outline</v-icon>
    </v-btn>
  </span>
</template>
<script>
import likeIdea from '@/graphql/mutations/likeIdea'
import unlikeIdea from '@/graphql/mutations/unlikeIdea'
import getIsIdeaLikedByMe from '@/graphql/query/getIsIdeaLikedByMe'

export default {
  name: 'LikeIdea',
  props: {
    isLiked: {
      type: Boolean,
      required: true
    },

    idea: {
      type: Object,
      required: true
    },

    isLoading: Boolean,
    isLoggedIn: Boolean
  },

  watch: {
    idea() {
      this.initIdeaState()
    }
  },

  mounted() {
    this.initIdeaState()
  },

  methods: {
    initIdeaState() {
      if (!this.$route.query.aa && this.isLoggedIn) {
        this.isLikedByMe()
      }
    },

    toggleIsLiked() {
      if (this.isLoading) {
        return
      }

      if (this.isLoggedIn) {
        if (!this.isLiked) {
          this.likeIdea()
        } else {
          this.unlikeIdea()
        }
      } else {
        this.showAskEmail()
      }
    },

    unlikeIdea() {
      this.$emit('unlike-idea', unlikeIdea)
    },

    likeIdea() {
      this.$emit('like-idea', likeIdea)
    },

    showAskEmail() {
      this.$emit('show-ask-email')
    },

    isLikedByMe() {
      this.$emit('is-liked-by-me', getIsIdeaLikedByMe)
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
