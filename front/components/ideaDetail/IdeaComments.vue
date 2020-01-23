<template>
  <div class="comments-part">
    <div class="comments-part__header">
      <v-row no-gutters>
        <v-col>
          <span class="likes-counter">
            <span class="likes-counter__image-container">
              <img
                v-if="idea.likesCount > 0"
                src="~/assets/images/lamp_on.png"
                class="likes-counter__image on"
              />
              <img
                v-else
                src="~/assets/images/lamp_off.png"
                class="likes-counter__image"
              />
            </span>
            <span class="likes-counter__label">{{ idea.likesCount }}</span>
          </span>
        </v-col>
        <v-col style="text-align: right">
          <span class="comments-counter">
            <img
              src="~/assets/images/comment.png"
              class="comments-counter__image"
            />
            <span class="comments-counter__label">{{
              idea.commentsCount
            }}</span>
          </span>
        </v-col>
      </v-row>
    </div>
    <div ref="scroller" class="comments-part__container">
      <div class="comments-part__container__table">
        <div class="comments-part__container__table__row">
          <div
            v-if="commentList.length"
            ref="commentsCol"
            class="comments-part__container__table__col"
          >
            <div
              v-if="idea.commentsCount > commentList.length && !deletingComment"
              style="text-align: center; padding: 5px 0; cursor: pointer;"
              @click="loadComments"
            >
              <v-btn small :loading="loadingMore">Load More...</v-btn>
            </div>

            <idea-comments-comment
              v-for="comment in commentList"
              :key="comment.commentId"
              :deletable="commentsDeletable"
              :comment="comment"
              @onDeleteComment="onDeleteComment"
            ></idea-comments-comment>
          </div>
          <div v-else class="comments-part__container__table__col empty">
            There are not comments yet. <br />
            Add the first one?
          </div>
        </div>
      </div>
    </div>
    <div class="comments-part__input-container">
      <v-text-field
        v-model="newCommentText"
        style="border-radius: 0; border: 1px solid #ebe7ed;"
        label="Say something..."
        single-line
        flat
        height="64"
        hide-details
        :disabled="!isAuthenticated"
        solo
        @keydown.enter="sendComment"
      >
        <template v-slot:append>
          <v-slide-y-transition hide-on-leave>
            <v-icon
              v-if="readyForSend && !showAddCommentLoader"
              @click="sendComment"
              >fa-paper-plane</v-icon
            >
          </v-slide-y-transition>
          <v-icon v-if="showAddCommentLoader" @click="sendComment"
            >fas fa-circle-notch fa-spin flag-icon
          </v-icon>
        </template>
      </v-text-field>
    </div>
    <simple-dialog-popup ref="simpleDialogPopup"></simple-dialog-popup>
  </div>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import IdeaCommentsComment from './IdeaCommentsComment'
import addComment from '~/graphql/mutations/addComment'
import getComments from '~/graphql/query/getComments'
import deleteComment from '~/graphql/mutations/deleteComment'
import simpleDialogPopup from '~/components/dialogs/simpleDialogPopup'

const COMMENTS_COUNT = 25

export default {
  name: 'IdeaComments',
  components: { IdeaCommentsComment, simpleDialogPopup },
  props: {
    idea: {
      type: Object,
      required: true
    },
    commentsDeletable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newCommentText: '',
      showAddCommentLoader: false,
      commentList: [],
      nextToken: null,
      loadingMore: false,
      deletingComment: false
    }
  },
  computed: {
    readyForSend() {
      return this.newCommentText.length > 0
    },
    isAuthenticated() {
      return this.$store.getters['userData/isAuthenticated']
    }
  },
  mounted() {
    this.doInitialCommentsLoading()
  },
  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.scroller.scrollTop = this.$refs.scroller.scrollHeight
      })
    },
    doInitialCommentsLoading() {
      if (this.idea.commentsCount > 0) {
        const fakeCommentsCount = Math.min(
          COMMENTS_COUNT,
          this.idea.commentsCount
        )
        const fakeComments = []
        for (let i = 0; i < fakeCommentsCount; i++) {
          fakeComments.push({
            fake: true
          })
        }
        this.commentList = fakeComments
        this.scrollToBottom()
      }
      this.loadComments()
    },
    async onDeleteComment(comment) {
      const confirmed = await this.$refs.simpleDialogPopup.show(
        'Delete Comment',
        'Are you sure you want to delete this Comment?'
      )
      if (!confirmed) {
        return
      }
      this.deletingComment = true
      this.$store.commit('layoutState/showProgressBar')
      try {
        this.commentList = this.commentList.filter(
          c => c.commentId !== comment.commentId
        )
        await this.$amplifyApi.graphql(
          graphqlOperation(deleteComment, {
            // body: body,
            // userId: this.$store.getters['cognito/userSub'],
            ideaId: this.$route.params.ideaId,
            ideaOwnerId: this.$route.params.userId,
            commentId: comment.commentId
          })
        )
        // remove comment form comment list array
        this.idea.commentsCount -= 1
        this.$emit('onNotification', {
          type: 'success',
          message: 'Comment Deleted!'
        })
      } catch (err) {
        this.$emit('onNotification', {
          type: 'error',
          message: "Can't Delete Comment!"
        })
      }
      this.deletingComment = false
      this.$store.commit('layoutState/hideProgressBar')
    },
    async sendComment() {
      this.showAddCommentLoader = true
      const commentText = this.newCommentText
      this.newCommentText = ''

      try {
        const result = await this.$amplifyApi.graphql(
          graphqlOperation(addComment, {
            body: commentText,
            ideaId: this.$route.params.ideaId,
            ideaOwnerId: this.$route.params.userId,
            userName: this.$store.getters['userData/userName'],
            userSlug: this.$store.getters['userData/slug']
          })
        )
        this.commentList.push(result.data.addComment.comment)
        this.idea.commentsCount += 1

        // this.fetchCommentList()
        this.showAddCommentLoader = false
        this.scrollToBottom()
        this.$emit('onNotification', {
          type: 'success',
          message: 'Comment Added!'
        })
      } catch (err) {
        this.$emit('onNotification', {
          type: 'error',
          message: "Can't add Comment. Please reload page and try again."
        })
        this.showAddCommentLoader = false
        this.newCommentText = commentText
      }
    },
    async loadComments() {
      this.loadingMore = true
      try {
        const result = await this.$amplifyApi.graphql({
          query: getComments,
          variables: {
            ideaId: this.$route.params.ideaId,
            limit: COMMENTS_COUNT,
            nextToken: this.nextToken
          },
          authMode: this.$store.getters['userData/isAuthenticated']
            ? undefined
            : 'API_KEY'
        })
        if (this.nextToken) {
          const lastEl = this.$refs.commentsCol.children[1]
          for (const comment of result.data.getComments.items) {
            this.commentList.unshift(comment)
          }
          this.$nextTick(() => {
            lastEl.scrollIntoView()
            this.$refs.scroller.scrollTop -= 55
          })
        } else {
          this.commentList = result.data.getComments.items.reverse()
          this.scrollToBottom()
        }

        this.nextToken = result.data.getComments.nextToken
      } catch (e) {
        this.$emit('onNotification', {
          type: 'error',
          message: "Can't load Comments. Please reload page and try again."
        })
        this.commentList = []
      }
      this.loadingMore = false
    }
  }
}
</script>

<style scoped lang="scss">
$counters-font-size: 18px;
.likes-counter {
  display: inline-block;

  &__image-container {
    display: inline-block;
    vertical-align: bottom;
    min-width: $counters-font-size + 7px;
    text-align: center;
    min-height: $counters-font-size + 5px;
  }

  &__image {
    display: inline-block;
    vertical-align: bottom;
    height: $counters-font-size + 1px;

    &.on {
      height: $counters-font-size + 5px;
    }
  }

  &__label {
    margin-left: 5px;
    display: inline-block;
    vertical-align: bottom;
    height: $counters-font-size;
    line-height: $counters-font-size;
    font-size: $counters-font-size;
  }
}

.comments-counter {
  &__image {
    display: inline-block;
    vertical-align: bottom;
    height: $counters-font-size;
  }

  &__label {
    margin-left: 8px;
    display: inline-block;
    vertical-align: bottom;
    height: $counters-font-size;
    line-height: $counters-font-size;
    font-size: $counters-font-size;
  }
}

.comments-part {
  /*background-color: #aed242;*/
  @media (max-width: $screen-sm-max) {
    height: calc(80vh - 84px);
  }
  @media (min-width: $screen-md-min) {
    height: calc(100vh - 84px);
  }

  overflow: hidden;

  &__header {
    padding: 15px;
    height: 64px;
    background-color: #ebe7ed;
  }

  &__container {
    background-color: #ebe7ed;
    @media (max-width: $screen-sm-max) {
      height: calc(80vh - 88px - 64px - 64px);
    }
    @media (min-width: $screen-md-min) {
      height: calc(100vh - 88px - 64px - 64px);
    }
    overflow: auto;
    /*height: 100%;*/

    display: block;

    &__table {
      width: 100%;
      height: 100%;
      display: table;

      &__row {
        display: table-row;
      }

      &__col {
        display: table-cell;
        vertical-align: bottom;

        &.empty {
          vertical-align: middle;
          text-align: center;
          color: #c0b7c5;
          font-size: 25px;
        }
      }
    }
  }

  &__input-container {
    height: 64px;
  }
}
</style>
