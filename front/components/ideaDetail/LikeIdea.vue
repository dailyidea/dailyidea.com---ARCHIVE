<template>
  <span>
    <v-btn small icon @click="toggleIsLiked">
      <v-icon v-if="isLoading">fas fa-circle-notch fa-spin</v-icon>
      <div v-else class="d-flex align-center">
        <img
          v-if="isLiked"
          class="icon"
          src="~/assets/images/idea-card/like-filled.png"
        />
        <img v-else class="icon" src="~/assets/images/idea-card/like.png" />
        <span class="count">{{ idea.savesCount }}</span>
      </div>
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
.icon {
  height: 18px;
}

.count {
  font-size: 14px;
  padding-top: 3px;
  padding-left: 4px;
}

.action-button {
  color: #ffb92d !important;
  &:hover {
    color: rgba(255, 185, 45, 0.76) !important;
  }
  width: 24px;
}
</style>
