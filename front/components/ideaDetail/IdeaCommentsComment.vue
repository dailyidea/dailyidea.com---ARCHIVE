<template>
  <div class="comment-container">
    <div
      class="comment-item d-flex flex-row"
      :class="{ temporary: comment.temporary }"
    >
      <div class="profilePic">(PIC)</div>
      <div class="comment d-flex flex-column">
        <div class="header d-flex flex-row justify-space-between ml-2">
          <div class="name">{{ comment.userName }}</div>
          <div class="time">
            <span
              v-if="!comment.fake && comment.createdDate"
              class="muted date-posted"
              >{{ comment.createdDate | toRelativeDate }}</span
            >
            <v-skeleton-loader
              v-else-if="comment.fake"
              light
              height="14"
              type="text"
              min-width="90"
            >
            </v-skeleton-loader>
            <v-btn
              v-if="deletable && !comment.fake"
              class="deleteCommentBtn"
              color="red"
              icon
              text
              x-small
              @click="onDeleteComment"
            >
              <v-icon class="color-danger" small
                >mdi-close-circle-outline</v-icon
              >
            </v-btn>
          </div>
        </div>
        <div class="body ml-2">
          <span v-if="!comment.fake">
            {{ comment.body }}
          </span>
          <v-skeleton-loader v-else light height="21" type="text">
          </v-skeleton-loader>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IdeaCommentsComment',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  computed: {
    deletable() {
      const currUsrId = this.$store.getters['userData/userId']
      if (currUsrId === undefined) {
        return false
      }

      const commentUsrId = this.comment.userId
      if (commentUsrId === undefined) {
        return false
      }

      // I can delete all the comments from my own ideas
      // and any user can delete their own comments from any idea too
      const isMyIdea = currUsrId === this.$route.params.userId
      return isMyIdea || currUsrId === commentUsrId
    }
  },
  methods: {
    onDeleteComment() {
      this.$emit('onDeleteComment', this.comment)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~/assets/style/common';

.comment-container {
  border-top: 2px solid $light-grey;
}

.comment-item {
  padding-top: 1rem;
  padding-bottom: 1rem;
  .comment {
    width: 100%;

    .header {
      width: 100%;
    }

    .name {
      color: $default-purple;
      font-size: 1.1rem;
      padding-bottom: 0.3rem;
    }

    .date-posted {
      font-size: 0.9rem;
    }
  }
}
</style>
