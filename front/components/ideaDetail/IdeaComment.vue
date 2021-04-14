<template>
  <div class="comment-cont">
    <div class="item d-flex flex-row" :class="{ temporary: comment.temporary }">
      <div class="profile-pic">
        <img :src="commentAvatar" />
      </div>
      <div class="comment-info d-flex flex-column flex-grow-1">
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
          <div v-if="editMode">
            <v-text-field
              ref="commentInput"
              v-model="form.body"
              class="comment-input"
              :rules="[value => !!value || 'Required.']"
              single-line
              hide-details
              @keydown.enter="updateComment"
              @keydown.left.stop
              @keydown.right.stop
            />
          </div>
          <div v-else>
            <span v-if="!comment.fake">
              {{ comment.body }}
            </span>
            <v-skeleton-loader
              v-else
              light
              height="21"
              type="text"
            ></v-skeleton-loader>
          </div>
        </div>
        <div class="footer mt-2 text-right">
          <div v-if="editMode">
            <v-btn
              color="red"
              text
              x-small
              :loading="updating"
              @click="updateComment"
            >
              <v-icon class="" small>mdi mdi-content-save</v-icon>
              <span class="ml-2 mt-1 delete-text" style="font-size: 0.8rem;"
                >Update</span
              >
            </v-btn>
            <v-btn
              v-if="!updating"
              color="red"
              text
              x-small
              @click="editMode = false"
            >
              <span class="mt-1 delete-text" style="font-size: 0.8rem;"
                >Cancel</span
              >
            </v-btn>
          </div>
          <div v-else>
            <v-btn
              v-if="editable && !comment.fake"
              color="red"
              text
              x-small
              @click="editComment"
            >
              <v-icon class="muted" small>mdi mdi-pencil</v-icon>
              <span
                class="muted ml-2 mt-1 delete-text"
                style="font-size: 0.8rem;"
                >Edit</span
              >
            </v-btn>
            <v-btn
              v-if="deletable && !comment.fake"
              color="red"
              text
              x-small
              @click="onDeleteComment"
            >
              <v-icon class="muted" small>mdi mdi-delete</v-icon>
              <span
                class="muted ml-2 mt-1 delete-text"
                style="font-size: 0.8rem;"
                >Delete</span
              >
            </v-btn>
          </div>
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
import { mapGetters } from 'vuex'
import updateComment from '@/graphql/mutations/updateComment'

export default {
  props: {
    comment: { type: Object, required: true }
  },

  data: () => ({
    editMode: false,
    updating: false,
    form: {
      body: ''
    }
  }),

  computed: {
    ...mapGetters({
      userId: 'userData/userId',
      avatar: 'userData/avatar'
    }),

    commentAvatar() {
      return this.comment.userAvatar || this.avatar
    },

    editable() {
      return this.userId === this.comment.userId
    },

    deletable() {
      if (!this.userId) {
        return false
      }

      // I can delete all the comments from my own ideas
      // and any user can delete their own comments from any idea too
      const isMyIdea = this.userId === this.$route.params.userId
      return isMyIdea || this.userId === this.comment.userId
    }
  },

  methods: {
    onDeleteComment() {
      this.$emit('onDeleteComment', this.comment)
    },

    editComment() {
      this.editMode = true
      this.form.body = this.comment.body
      this.$nextTick(() => {
        this.$refs.commentInput.focus()
      })
    },

    async updateComment() {
      if (!this.form.body) {
        return
      }
      this.updating = true
      const result = await this.$amplifyApi.graphql({
        query: updateComment,
        variables: {
          ideaId: this.comment.ideaId,
          commentId: this.comment.commentId,
          body: this.form.body
        }
      })
      this.$emit('comment-updated', result.data.updateComment.comment)
      this.updating = false
      this.editMode = false
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';

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

.body {
  word-break: break-word;
}
</style>
