<template>
  <span>
    <v-btn small icon @click="toggleIsSaved">
      <v-icon v-if="isLoading">fas fa-circle-notch fa-spin</v-icon>
      <v-icon v-else-if="!isLoading && isSaved" class="action-button">
        mdi-bookmark-plus
      </v-icon>
      <v-icon v-else>mdi-bookmark-plus-outline</v-icon>
    </v-btn>
  </span>
</template>
<script>
import getIsIdeaSavedByMe from '@/graphql/query/getIsIdeaSavedByMe'
import saveIdea from '@/graphql/mutations/saveIdea'
import unsaveIdea from '@/graphql/mutations/unsaveIdea'

export default {
  name: 'SaveIdea',
  props: {
    isSaved: {
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
        this.isSavedByMe()
      }
    },

    toggleIsSaved() {
      if (this.isLoading) {
        return
      }

      if (this.isLoggedIn) {
        if (!this.isSaved) {
          this.saveIdea()
        } else {
          this.unsaveIdea()
        }
      } else {
        this.showAskEmail()
      }
    },

    unsaveIdea() {
      this.$emit('unsave-idea', unsaveIdea)
    },

    saveIdea() {
      this.$emit('save-idea', saveIdea)
    },

    showAskEmail() {
      this.$emit('show-ask-email')
    },

    isSavedByMe() {
      this.$emit('is-saved-by-me', getIsIdeaSavedByMe)
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
