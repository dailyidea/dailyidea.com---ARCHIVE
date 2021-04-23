<template>
  <div class="comments-part d-flex flex-column fill-height">
    <div
      ref="scroller"
      class="comments-part__container overflow-y-auto hide-scrollbar fade-bottom flex-1"
    >
      <div v-if="commentList.length" ref="commentsCol">
        <div
          v-if="idea.commentsCount > commentList.length && !deletingComment"
          class="loadComments"
          @click="loadComments"
        >
          <v-btn small :loading="loadingMore">Load More...</v-btn>
        </div>
        <div class="muted desktop-comments-title hidden-sm-and-down">
          Comments
        </div>

        <idea-comment
          v-for="comment in commentList"
          :key="comment.commentId"
          :comment="comment"
          @onDeleteComment="onDeleteComment"
          @comment-updated="onUpdateComment"
        ></idea-comment>
      </div>
      <div v-else class="text-center muted">
        <p>No comments yet.</p>
        <p>Be the first!</p>
      </div>
    </div>
    <div class="comment-and-post-btn d-flex flex-column">
      <div class="comments-part__input-container d-flex align-center">
        <img :src="avatar" class="comment-avatar" />
        <v-text-field
          ref="commentInput"
          v-model="newCommentText"
          class="comment-input"
          label="Join the conversation..."
          single-line
          flat
          hide-details
          solo
          @keydown.enter="onAddCommentAttempt"
          @keydown.left.stop
          @keydown.right.stop
        >
          <template v-slot:append>
            <v-icon
              v-if="showAddCommentLoader"
              small
              class="color-primary"
              @click="onAddCommentAttempt"
              >fas fa-circle-notch fa-spin flag-icon
            </v-icon>
          </template>
        </v-text-field>
      </div>
      <v-btn
        v-if="newCommentText"
        color="primary"
        class="mt-5 fill-width"
        @click="onAddCommentAttempt"
        >Post Comment
      </v-btn>
    </div>

    <auth-flow
      v-model="showAuth"
      :idea="idea"
      action="comment"
      :comment="tmpDbComment"
      :user-id-callback="userIdCallback"
      @cancel="cancelNewComment"
    />
  </div>
</template>

<script>
import nanoid from 'nanoid'
import { graphqlOperation } from '@aws-amplify/api'
import { mapMutations, mapGetters } from 'vuex'
import IdeaComment from './IdeaComment'
import deleteIdeaTemporaryComment from '@/graphql/mutations/deleteIdeaTemporaryComment'
import checkEmailBelongsToExistingUser from '@/graphql/query/checkEmailBelongsToExistingUser'
import addIdeaTemporaryComment from '@/graphql/mutations/addIdeaTemporaryComment'
import getIdeaTemporaryComment from '@/graphql/query/getIdeaTemporaryComment'
import setWasWelcomed from '@/graphql/mutations/setWasWelcomed'
import addComment from '~/graphql/mutations/addComment'
import getComments from '~/graphql/query/getComments'
import deleteComment from '~/graphql/mutations/deleteComment'
import AuthFlow from '@/components/auth/AuthFlow'

const COMMENTS_COUNT = 25

export default {
  components: {
    AuthFlow,
    IdeaComment
  },

  props: {
    idea: { type: Object, required: true }
  },

  data() {
    return {
      tmpComment: {},
      newCommentText: '',
      tmpCommentText: '',
      tmpDbComment: null,
      showAddCommentLoader: false,
      commentList: [],
      nextToken: null,
      loadingMore: false,
      deletingComment: false,
      temporaryCommentId: undefined,
      showAuth: false,
      userId: null
    }
  },

  computed: {
    ...mapGetters({
      isAuthenticated: 'userData/isAuthenticated',
      avatar: 'userData/avatar'
    })
  },

  watch: {
    idea() {
      // Ensure nextToken is null so there is no error fetching new idea comments.
      // Otherwise an invalid next token error is thrown.

      this.nextToken = null
      this.doInitialCommentsLoading()
    }
  },

  mounted() {
    this.doInitialCommentsLoading()
  },

  methods: {
    ...mapMutations({
      showProgressBar: 'layoutState/showProgressBar',
      hideProgressBar: 'layoutState/hideProgressBar'
    }),

    scrollToBottom() {
      this.$nextTick(() => {
        if (!this.$refs.scroller) {
          return
        }
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
          fakeComments.push({ fake: true, commentId: nanoid() })
        }
        this.commentList = fakeComments
        this.scrollToBottom()
      }
      if (this.$route.query.aa === 'itc') {
        // instantiate temporary comment
        this.temporaryCommentId = this.$route.query.tci
        this.commentList.push({
          fake: true,
          temporary: true,
          commentId: this.temporaryCommentId
        })
        this.createCommentFromTemporary(this.temporaryCommentId)
      }
      this.loadComments()
    },

    async createCommentFromTemporary(commentId) {
      const result = await this.$amplifyApi.graphql({
        query: getIdeaTemporaryComment,
        variables: { commentId },
        authMode: 'API_KEY'
      })
      if (result.data.getIdeaTemporaryComment.result.ok) {
        const temporaryComment = result.data.getIdeaTemporaryComment.comment
        temporaryComment.temporary = true
        temporaryComment.userName = this.$store.getters['userData/userName']
        this.commentList.splice(this.commentList.length - 1, 1)
        this.commentList.push(temporaryComment)
        await this.sendComment(temporaryComment.body, true)
        await this.deleteIdeaTemporaryComment(commentId)
        this.scrollToBottom()
      } else {
        this.commentList.splice(this.commentList.length - 1, 1)
        this.$router.replace({ query: null })
      }
    },

    async onDeleteComment(comment) {
      const confirmed = await this.$dialog.show({
        header: 'Do you want to delete your comment?',
        message: 'This action cannot be undone.',
        buttonOkText: 'Delete',
        error: true,
        showCancelButton: true,
        imagePath: require('~/assets/images/dialogs/undraw_throw_away_ldjd.svg')
      })
      if (!confirmed) {
        return
      }
      this.deletingComment = true
      this.showProgressBar()
      try {
        const resp = await this.$amplifyApi.graphql(
          graphqlOperation(deleteComment, {
            ideaId: this.idea.ideaId,
            ideaOwnerId: this.idea.userId,
            commentId: comment.commentId
          })
        )
        if (resp.data.deleteComment.error) {
          throw new Error(resp.data.deleteComment.error)
        }

        // remove comment form comment list array
        this.commentList = this.commentList.filter(
          c => c.commentId !== comment.commentId
        )
        this.idea.commentsCount -= 1
      } catch (err) {
        this.$notifier.error("Can't Delete Comment!")
      }
      this.deletingComment = false
      this.hideProgressBar()
    },

    onUpdateComment(comment) {
      const idx = this.commentList.findIndex(
        c => c.commentId === comment.commentId
      )
      if (idx !== -1) {
        this.commentList[idx] = comment
        this.$forceUpdate()
      }
    },

    async deleteIdeaTemporaryComment(commentId) {
      try {
        await this.$amplifyApi.graphql(
          graphqlOperation(deleteIdeaTemporaryComment, { commentId })
        )
      } catch (e) {
        this.$sentry.captureException(e)
      }
    },

    onAddCommentAttempt() {
      const commentText = this.newCommentText
      this.tmpCommentText = commentText
      this.newCommentText = ''
      this.showAddCommentLoader = true
      const isAuthenticated = this.$store.getters['userData/isAuthenticated']
      if (isAuthenticated) {
        this.sendComment(commentText)
      } else {
        this.appendFakeCommentAndStartAuth()
      }
    },

    checkEmailBelongsToExistingUser(email) {
      return this.$amplifyApi.graphql({
        query: checkEmailBelongsToExistingUser,
        variables: { email },
        authMode: 'API_KEY'
      })
    },

    addTemporaryFakeComment(text) {
      this.tmpComment = {
        userName: 'Me',
        body: text,
        temporary: true
      }
      this.commentList.push(this.tmpComment)
      this.scrollToBottom()
    },

    processCommentInstantiation() {
      const wasWelcomed = this.$store.getters['userData/wasWelcomed']
      if (wasWelcomed) {
        this.$notifier.success('Comment Posted!')
      } else {
        this.$notifier.show({
          message: 'First Comment Posted!',
          color: 'green',
          iconPosition: 'before',
          iconName: 'hooray'
        })
        this.$amplifyApi.graphql(
          graphqlOperation(setWasWelcomed, {
            userId: this.$store.getters['userData/userId']
          })
        )
      }
      this.$router.replace({ query: null })
    },

    async createTmpDbComment(userId) {
      const res = await this.$amplifyApi.graphql({
        query: addIdeaTemporaryComment,
        variables: {
          userId,
          body: this.tmpCommentText,
          ideaId: this.idea.ideaId,
          ideaName: this.idea.title,
          ideaOwnerId: this.idea.userId
        },
        authMode: 'API_KEY'
      })
      this.tmpDbComment = res.data.addIdeaTemporaryComment.comment
    },

    async userIdCallback(userId) {
      await this.createTmpDbComment(userId)
    },

    appendFakeCommentAndStartAuth() {
      this.showAddCommentLoader = false
      this.addTemporaryFakeComment(this.tmpCommentText)
      this.showAuth = true
    },

    async sendComment(commentText, instantiation = false) {
      try {
        const result = await this.$amplifyApi.graphql(
          graphqlOperation(addComment, {
            body: commentText,
            ideaId: this.idea.ideaId,
            ideaOwnerId: this.idea.userId,
            userName: this.$store.getters['userData/userName'],
            userSlug: this.$store.getters['userData/slug']
          })
        )
        const newComment = result.data.addComment.comment
        if (instantiation) {
          newComment.temporary = true
          this.$set(this.commentList, this.commentList.length - 1, newComment)
          this.$nextTick(() => {
            this.$set(
              this.commentList[this.commentList.length - 1],
              'temporary',
              false
            )
          })
          this.idea.commentsCount += 1
          setTimeout(() => {
            this.processCommentInstantiation()
          }, 2000)
          this.scrollToBottom()
          return
        } else {
          this.commentList.push(newComment)
          this.idea.commentsCount += 1
          this.scrollToBottom()
        }
        // this.fetchCommentList()
        this.showAddCommentLoader = false

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
            ideaId: this.idea.ideaId,
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
          this.commentList = this.commentList.filter(
            c => c.commentId === this.temporaryCommentId
          ) // remove comments placeholder but not temporary comment - it is loaded separately
          for (const comment of result.data.getComments.items) {
            this.commentList.unshift(comment)
          }
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
    },

    cancelNewComment() {
      this.newCommentText = ''
      this.commentList.pop()
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';
$counters-font-size: 18px;

.desktop-comments-title {
  font-size: 18px;
}

.container {
  @media only screen and (min-width: $screen-md-min) {
    overflow-y: auto;
    padding-left: 0;
    padding-right: 12px;
  }
}

.comments-part {
  width: 100%;

  @media only screen and (min-width: $screen-md-min) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    border-left: 2px solid $light-grey;
    padding-left: 1rem;
    overflow-y: auto;
  }

  &__header {
    padding: 15px;
  }

  &__container {
    @media (min-width: $screen-md-min) {
      padding-bottom: 2rem;
    }
    overflow: auto;

    display: block;
  }
  .loadComments {
    text-align: center;
    padding: 5px 0;
    cursor: pointer;
  }

  &__input-container {
    border-radius: 0;
    border-top: 2px solid $light-grey;
    border-bottom: 2px solid $light-grey;

    .comment-avatar {
      width: 32px;
    }
  }
}

.comment-and-post-btn {
  overflow: hidden;
  display: flex;
  justify-content: flex-end;

  .post-comment-btn {
    .v-btn {
      background-color: $default-purple !important;
    }
  }
}
</style>
