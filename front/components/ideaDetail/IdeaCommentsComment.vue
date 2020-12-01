<template>
  <div class="comment-cont">
    <div class="item d-flex flex-row" :class="{ temporary: comment.temporary }">
      <div class="profile-pic">
        <img :src="commentAvatar" />
      </div>
      <div class="comment-info d-flex flex-column">
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
          </div>
        </div>
        <div class="body ml-2">
          <span v-if="!comment.fake">
            {{ comment.body }}
          </span>
          <v-skeleton-loader v-else light height="21" type="text">
          </v-skeleton-loader>
        </div>
        <div class="footer mt-2">
          <v-btn
            v-if="deletable && !comment.fake"
            color="red"
            icon
            text
            x-small
            @click="onDeleteComment"
          >
            <v-icon class="muted" small>mdi mdi-delete</v-icon>
            <span class="muted ml-2 mt-1 delete-text">Delete</span>
          </v-btn>
        </div>
        <div v-if="comment.temporary" class="pending-wrap">
          <span class="pending-label">pending</span>
          <span class="pending-text"
            >Comment will be posted once email is confirmed</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IdeaCommentsComment',
  props: {
    comment: { type: Object, required: true }
  },
  computed: {
    commentAvatar() {
      return this.comment.userAvatar || this.$store.getters['userData/avatar']
    },

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

.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  .delete-text {
    font-size: 0.8rem;
  }
}

.profile-pic {
  img {
    height: 24px;
  }
}

.temporary {
  background-color: #f8f8fa;
  color: #74707d;
}

.comment-cont {
  @media only screen and (max-width: $screen-sm-max) {
    border-top: 2px solid $light-grey;
  }

  @media only screen and (min-width: $screen-md-min) {
    border-bottom: 2px solid $light-grey;
  }

  .item {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-radius: 10px;
    .comment-info {
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
}

.pending-wrap {
  padding: 0 7px;
  margin-bottom: -0.25rem;
}

.pending-label {
  display: inline-block;
  padding: 0 10px;
  border: 1px solid #5d43bc;
  border-radius: 10px;
  color: #5d43bc;
  font-size: 0.75rem;
}

.pending-text {
  color: #74707d;
  font-size: 0.75rem;
  font-style: italic;
  letter-spacing: -0.8px;
}
</style>
