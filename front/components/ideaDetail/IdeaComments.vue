<template>
  <div class="comments-part">
    <div class="comments-part__header text-center">
      <strong class="muted">Comments</strong>
    </div>
    <v-container ref="scroller" class="comments-part__container">
      <div v-if="commentList.length" ref="commentsCol" class="">
        <div
          v-if="idea.commentsCount > commentList.length && !deletingComment"
          class="loadComments"
          @click="loadComments"
        >
          <v-btn small :loading="loadingMore">Load More...</v-btn>
        </div>

        <idea-comments-comment
          v-for="comment in commentList"
          :key="comment.commentId"
          :comment="comment"
          @onDeleteComment="onDeleteComment"
        ></idea-comments-comment>
      </div>
      <v-row v-else class="empty" align="center">
        <v-col class="muted">
          <p>
            <v-icon>mdi-comment-plus-outline</v-icon>
          </p>
          <p>No comments yet.</p>
          <p>Be the first!</p>
        </v-col>
      </v-row>
    </v-container>
    <div class="comments-part__input-container">
      <v-text-field
        v-model="newCommentText"
        label="Add a comment..."
        single-line
        flat
        hide-details
        solo
        @keydown.enter="onAddCommentAttempt"
      >
        <template v-slot:append>
          <v-slide-y-transition hide-on-leave>
            <v-icon
              v-if="readyForSend && !showAddCommentLoader"
              small
              class="color-primary"
              @click="onAddCommentAttempt"
              >fa-paper-plane
            </v-icon>
          </v-slide-y-transition>
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

    <default-dialog
      v-model="showFirstCommentInstantiated"
      header="Welcome!"
      :show-cancel-button="false"
      @ok="() => (showFirstCommentInstantiated = false)"
    >
      <p>
        Thanks for posting that comment! Feel free to
        <router-link to="/ideas/all">browse for other ideas</router-link> or
        <router-link to="/ideas/create">add your own ideas</router-link>
        .
      </p>
    </default-dialog>

    <ask-email-dialog
      v-model="showAskEmail"
      header="Introduce yourself?"
      message="Before we post this for everyone to see, can you please confirm your email address?"
      button-cancel-text="Delete comment"
      @cancel="cancelNewComment"
      @data="onNoAuthEmail"
    ></ask-email-dialog>

    <ask-name-dialog
      v-model="showAskName"
      header="Almost there"
      message="What can we call you?"
      button-cancel-text="Delete comment"
      @cancel="cancelNewComment"
      @data="onNoAuthName"
    ></ask-name-dialog>
  </div>
</template>

<script>
import nanoid from 'nanoid'
import { graphqlOperation } from '@aws-amplify/api'
import { mapMutations, mapGetters } from 'vuex'
import AskNameDialog from './AskNameDialog'
import AskEmailDialog from './AskEmailDialog'
import IdeaCommentsComment from './IdeaCommentsComment'
import checkEmailBelongsToExistingUser from '@/graphql/query/checkEmailBelongsToExistingUser'
import addIdeaTemporaryComment from '@/graphql/mutations/addIdeaTemporaryComment'
import getIdeaTemporaryComment from '@/graphql/query/getIdeaTemporaryComment'
import setWasWelcomed from '@/graphql/mutations/setWasWelcomed'
import deleteIdeaTemporaryComment from '@/graphql/mutations/deleteIdeaTemporaryComment'
import DefaultDialog from '@/components/dialogs/DefaultDialog'
import addComment from '~/graphql/mutations/addComment'
import getComments from '~/graphql/query/getComments'
import deleteComment from '~/graphql/mutations/deleteComment'

const COMMENTS_COUNT = 25

export default {
  name: 'IdeaComments',

  components: {
    IdeaCommentsComment,
    DefaultDialog,
    AskEmailDialog,
    AskNameDialog
  },

  props: {
    idea: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      tmpComment: {},
      newCommentText: '',
      tmpCommentText: '',
      showAddCommentLoader: false,
      commentList: [],
      nextToken: null,
      loadingMore: false,
      deletingComment: false,
      temporaryCommentId: undefined,

      showAskEmail: false,
      email: '',
      showAskName: false,
      name: '',

      showFirstCommentInstantiated: false
    }
  },

  computed: {
    ...mapGetters({
      isAuthenticated: 'userData/isAuthenticated'
    }),

    readyForSend() {
      return this.newCommentText.length > 0
    }
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
        if (!this.$refs.scroller) return
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
            fake: true,
            commentId: nanoid()
          })
        }
        this.commentList = fakeComments
        this.scrollToBottom()
      }
      let additionalAction

      if (this.$route.query.aa) {
        additionalAction = this.$route.query.aa
        if (additionalAction === 'itc') {
          // instantiate temporary comment
          this.temporaryCommentId = this.$route.query.tci
          this.commentList.push({
            fake: true,
            temporary: true,
            commentId: this.temporaryCommentId
          })
          this.getTemporaryComment(this.temporaryCommentId)
        }
      }
      this.loadComments()
    },

    async getTemporaryComment(commentId) {
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
        header: 'Delete Comment',
        message: 'Are you sure you want to delete this comment?',
        buttonOkText: 'Yes, Delete',
        imagePath: require('~/assets/images/dialogs/undraw_throw_away_ldjd.svg'),
        showCancelButton: true
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
      this.hideProgressBar()
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
        this.appendFakeCommentAndEncourageToRegisterOrSignUp()
      }
    },

    checkEmailBelongsToExistingUser(email) {
      return this.$amplifyApi.graphql({
        query: checkEmailBelongsToExistingUser,
        variables: {
          email
        },
        authMode: 'API_KEY'
      })
    },

    addTemporaryFakeComment(text) {
      this.tmpComment = { userName: 'Me', body: text, temporary: true }
      this.commentList.push(this.tmpComment)
      this.scrollToBottom()
    },

    removeTemporaryFakeComment() {
      this.commentList.splice(this.commentList.indexOf(this.tmpComment), 1)
    },

    processCommentInstantiation() {
      const wasWelcomed = this.$store.getters['userData/wasWelcomed']
      if (wasWelcomed) {
        this.$dialog.show({
          header: 'Welcome back!',
          message: 'Thanks for posting that comment!'
        })
      } else {
        this.showFirstCommentInstantiated = true
        this.$amplifyApi.graphql(
          graphqlOperation(setWasWelcomed, {
            userId: this.$store.getters['userData/userId']
          })
        )
      }
      this.$router.replace({ query: null })
    },

    async createTemporaryCommentInDB(userId, commentText) {
      const res = await this.$amplifyApi.graphql({
        query: addIdeaTemporaryComment,
        variables: {
          userId,
          body: commentText,
          ideaId: this.idea.ideaId,
          ideaName: this.idea.title,
          ideaOwnerId: this.idea.userId
        },
        authMode: 'API_KEY'
      })
      return res.data.addIdeaTemporaryComment.comment
    },

    async requestAuthAndProcessComment(userId, email, commentText) {
      this.showProgressBar()
      const comment = await this.createTemporaryCommentInDB(userId, commentText)
      await this.$amplifyApi.post('RequestLogin', '', {
        body: { email, commentId: comment.commentId }
      })
      this.hideProgressBar()
      this.$dialog.show({
        header: 'Welcome back!',
        message: `It looks like you weren't signed in. We just sent you a verification email. Please check your inbox and click on the link and we'll post your comment ASAP.`
      })
    },

    async registerUserAndProcessComment(commentText) {
      this.showProgressBar()
      const res = await this.$store.dispatch('cognito/registerUser', {
        username: this.email,
        password: nanoid(),
        attributes: { name: this.name }
      })
      const userId = res.userSub
      const comment = await this.createTemporaryCommentInDB(userId, commentText)
      await this.$amplifyApi.post('RequestLogin', '', {
        body: { email: this.email, commentId: comment.commentId }
      })
      this.hideProgressBar()
      this.$dialog.show({
        header: 'Thanks!',
        message: `We just sent you an email to confirm that you're a real person :) Please check your inbox then click on the link and we'll post your comment ASAP.`
      })
      this.hideProgressBar()
    },

    appendFakeCommentAndEncourageToRegisterOrSignUp() {
      this.showAddCommentLoader = false
      this.addTemporaryFakeComment(this.tmpCommentText)
      this.showAskEmail = true
    },

    async onNoAuthEmail(email) {
      this.showAskEmail = false
      this.email = email.toLowerCase()
      this.showProgressBar()

      try {
        const result = await this.checkEmailBelongsToExistingUser(email)
        const belongsToExistingUser =
          result.data.checkEmailBelongsToExistingUser.belongsToExistingUser
        this.hideProgressBar()
        if (belongsToExistingUser) {
          const userId = result.data.checkEmailBelongsToExistingUser.userId
          await this.requestAuthAndProcessComment(
            userId,
            email,
            this.tmpCommentText
          )
          this.tmpCommentText = ''
        } else {
          this.showAskName = true
        }
      } catch (e) {
        this.removeTemporaryFakeComment()
        this.hideProgressBar()
      }
    },

    async onNoAuthName(name) {
      this.showAskName = false
      this.name = name
      this.showProgressBar()
      await this.registerUserAndProcessComment(this.tmpCommentText)
      this.tmpCommentText = ''
      this.hideProgressBar()
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
$light-grey: #f3f0f4;
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
  @media (min-width: $screen-md-min) {
    height: calc(100vh - 88px - 24px);
    /* i hate these height calculations. right now this is a mess. i added 24 here because that's how much padding there is */
  }

  overflow: hidden;

  &__header {
    padding: 15px;
    background-color: $light-grey;
  }

  &__container {
    background-color: $light-grey;
    @media (min-width: $screen-md-min) {
      height: calc(100vh - 64px - 12px - 54px - 54px - 10px - 24px);
      /*64 desktop header height 12 main content area padding (below header) 54 comment header 54 comment input*/
      /* why the extra 10 at the end? I don't know! */
    }
    overflow: auto;
    /*height: 100%;*/

    display: block;
  }
  .loadComments {
    text-align: center;
    padding: 5px 0;
    cursor: pointer;
    /* legacy */
  }
  .empty {
    height: 100%;
    text-align: center;
  }

  &__input-container {
    border-radius: 0;
    border: 1px solid $light-grey;
  }
}
</style>
