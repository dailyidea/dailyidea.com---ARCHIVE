<template>
  <Layout
    v-bind="{
      currentPage: 'IdeaDetail',
      pageOptions: mobileHeaderUiOptions
    }"
    @showShareIdeaDialog="showShareIdeaDialog"
    @showSaveIdeaForMobileDailog="showSaveIdeaMobileViewDailog = true"
    @showPrivateIdeaDailog="privateIdeaDailog = true"
    @onEditIdea="showIdeaEditor"
    @onSaveUnSaveIdea="copyShareLink"
    @onMakeIdeaPublicPrivate="copyShareLink"
    @onCopyShareIdeaLink="copyShareLink"
  >
    <v-row id="ideaDetailPage" no-gutters>
      <!-- Left Side Idea Information -->
      <v-col cols="12" sm="6" class="profileDetails">
        <!-- Header section - only for desktop -->
        <v-toolbar color="white" flat class="desktopHeader hidden-sm-and-down">
          <v-toolbar-title class="pageTitle">
            <template v-if="isIdeaEditable">
              Ravi's Idea
            </template>
            <v-btn
              v-else
              :class="{ lightPinkButton: !isIdeaEditMode }"
              rounded
              outlined
              class="editIdeaButton"
            >
              My Idea &nbsp;
              <v-icon left>mdi-pencil</v-icon>
            </v-btn>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- Bookmark button -->
          <v-btn text icon color="gray" class="bookmarkIdeaButton">
            <img
              v-if="isIdeaBookmarked"
              class="saveIdea"
              src="~/assets/images/saveIdeaImage.png"
              @click="$emit('showSaveIdeaForMobileDailog')"
            />
            <img
              v-if="!isIdeaBookmarked"
              class="unsaveIdea"
              src="~/assets/images/unSaveIdeaImage.png"
              @click="$emit('showSaveIdeaForMobileDailog')"
            />
          </v-btn>
          <!-- Idea Detail Mobile Settings Menu -->
          <v-menu>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>Share</v-list-item-title>
              </v-list-item>
              <v-list-item @click="$emit('showShareIdeaDialog')">
                <v-list-item-title>Share by Email</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Report Idea</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
        <div v-if="!ideaEditorVisible" class="ideaTitle">
          {{ idea.title }}{{ idea.title }}{{ idea.title }}
        </div>
        <div v-else class="editIdeaTitle">
          <v-textarea
            v-model="idea.title"
            v-validate="'required|max:100'"
            :error-messages="errors.collect('title')"
            data-vv-name="title"
            outlined
            label="Idea Title"
          >
          </v-textarea>
        </div>
        <!-- Metadata -->
        <div class="metadata">
          <span>
            <v-icon class="circle">mdi-checkbox-blank-circle</v-icon>
            &nbsp;
            {{ user.email }}
          </span>
          <span class="timing">{{ idea.relativeCreatedTime }}</span>
        </div>
        <!-- Description -->
        <div v-if="!ideaEditorVisible" class="ideaDescription">
          <!-- <v-layout v-html="idea.content"> </v-layout> -->
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim.Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim. Excepteur sint occaecat cupidatat non provident.
          Excepteur sint occaecat cupidatat non provident. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim.
        </div>
        <div v-else class="ideaEditor">
          <VueTrix
            v-model="ideaEditContents"
            class="editor"
            placeholder="Enter content"
          />
          <div v-if="!ideaEditContents" class="errorMsg">
            {{ errorMsg }}
          </div>
        </div>
        <div class="nextPreviousIdeasButton">
          <div class="arrowBtn">
            <v-btn text small class="leftBtn" fab>
              <v-icon> fas fa-arrow-left</v-icon>
            </v-btn>
            <v-btn text small class="leftBtn" fab>
              <v-icon>fas fa-arrow-right</v-icon>
            </v-btn>
          </div>
        </div>
        <!--submit and cancel btn-->
        <div v-if="ideaEditorVisible" class="buttons">
          <v-btn
            small
            color="primary"
            :loading="updatingIdea"
            @click="onSaveIdeaContent()"
            >Save</v-btn
          >
          <v-btn text small color="error" @click="ideaEditorVisible = false"
            >Cancel</v-btn
          >
        </div>
        <!-- Engagements & Next Prev -->
        <v-layout class="engagement-nextPrev" hidden-md-and-up>
          <!-- Engagement -->
          <div class="engagement">
            <div class="ups">
              <img class="lamp" src="~/assets/images/dark_gray_lamp.png" />
              <span>609</span>
            </div>
            <div class="downs">
              <img class="cmt" src="~/assets/images/comments.png" />
              <span>120</span>
            </div>
          </div>
          <!-- Mobile Only - next prev button -->
          <div class="arrowBtn">
            <v-btn text small class="leftBtn" fab>
              <v-icon> fas fa-arrow-left</v-icon>
            </v-btn>
            <v-btn text small class="rightBtn" fab>
              <v-icon>fas fa-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-layout>
      </v-col>
      <!-- Right Side Comment List -->
      <v-col cols="12" sm="6" class="rightSideComments">
        <!-- If Comments Found -->
        <div v-if="commentList && commentList.length > 0">
          <!-- Comment Statistics -->
          <v-layout class="cmtAndLike" hidden-sm-and-down>
            <div class="ups">
              <v-btn text @click="toggleLikeIdea">
                <img
                  v-if="isIdeaLiked"
                  class="lamp"
                  src="~/assets/images/logo_icon.png"
                />
                <img
                  v-else
                  class="lamp"
                  src="~/assets/images/dark_gray_lamp.png"
                />
                <span>{{ idea.likesCount }}</span>
              </v-btn>
            </div>
            <div class="downs">
              <img class="cmt" src="~/assets/images/comments.png" />
              <span>{{ idea.commentsCount }}</span>
            </div>
          </v-layout>
          <!-- Comment List -->
          <div
            v-for="(item, index) in commentList"
            :key="index"
            class="commentItem"
          >
            <div class="header">
              <div class="commentUser">{{ item.userId }}</div>
              <div class="timing">
                1h
                <v-btn
                  class="deleteCommentBtn"
                  color="red"
                  icon
                  text
                  x-small
                  @click="deleteComment(item.commentId, item.body, index)"
                >
                  <v-icon color="red">fas fa-trash-alt</v-icon>
                </v-btn>
              </div>
            </div>
            <div class="commentText">
              {{ item.body }}
            </div>
          </div>
          <!-- LodaMore Button -->
          <div class="loadMoreBtn">
            <!-- <v-btn @click="loadMoreIdea()" :loading="loadingIdea" v-if="nextToken">
                  Load More
                  </v-btn> -->
            <a v-if="nextToken" @click="loadMoreComments()">
              Lode More Comments......
            </a>
          </div>
        </div>
        <!-- No Comments Found Div -->
        <div v-else class="noCommentDiv">
          <div>There are not comments yet. <br />Add the first one?</div>
        </div>
      </v-col>
    </v-row>

    <!-- Foter with textbox -->
    <div class="pageFooter">
      <v-row no-gutters>
        <v-col cols="12" sm="6" class="leftSideTagsSection hidden-sm-and-down">
          <!-- Tags -->
          <div v-if="!ideaEditorVisible" class="tagsContainer">
            <v-chip
              v-for="(item, index) in ideaTags"
              :key="index"
              label
              class="tag"
              >{{ item }}</v-chip
            >
          </div>
          <div v-else class="tagsEditor">
            <v-combobox
              v-model="ideaTags"
              v-validate="'required|max:100'"
              :error-messages="errors.collect('tag')"
              data-vv-name="tag"
              class="ideaTag"
              times
              chips
              clearable
              outlined
              label="Add Tags"
              multiple
            >
              <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip
                  v-bind="attrs"
                  :input-value="selected"
                  close
                  label
                  @click="select;"
                  @click:close="removeTag(item)"
                >
                  <strong>{{ item }}</strong>
                </v-chip>
              </template>
            </v-combobox>
          </div>
        </v-col>
        <v-col cols="12" sm="6" class="rightSideNewCommentSection">
          <v-text-field
            v-model="currentComment"
            hide-details
            class="newCommentInput"
            flat
            solo
            label="Say something..."
            large
          >
          </v-text-field>
          <!-- Popip -ShowComment Dialogbox-->
          <div>
            <v-btn
              class="sendBtn"
              text
              icon
              flat
              :loading="updatingComment"
              @click="addCommentBox()"
            >
              <v-icon color="#d4bb10">fas fa-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Bottom snackbar message -->
    <v-snackbar
      v-model="snackbarVisible"
      :timeout="2000"
      :color="snackbarColor"
    >
      {{ snackbarMessage }}
      <v-btn color="white" text @click="snackbarVisible = false">
        Close
      </v-btn>
    </v-snackbar>
  </Layout>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import getIsIdeaLikedByMe from '~/graphql/query/getIsIdeaLikedByMe'
import updateIdea from '~/graphql/mutations/updateIdea'
import addComment from '~/graphql/mutations/addComment'
import deleteComment from '~/graphql/mutations/deleteComment'
import getIdeaTags from '~/graphql/query/getIdeaTags'
import getComments from '~/graphql/query/getComments'
import likeIdea from '~/graphql/mutations/likeIdea'
import unlikeIdea from '~/graphql/mutations/unlikeIdea'
import Layout from '@/components/layout/Layout'
import addTags from '~/graphql/mutations/addTags'
import deleteIdea from '~/graphql/mutations/deleteIdea'
import deleteTag from '~/graphql/mutations/deleteTag'
import getUsersIdea from '~/graphql/query/getUsersIdea'

dayjs.extend(relativeTime)

export default {
  components: { Layout },
  $_veeValidate: {
    validator: 'new'
  },
  data: () => ({
    mobileHeaderUiOptions: {
      pageTitle: "Bob's Idea",
      leftButtonType: 'back',
      isIdeaBookmarked: false,
      isIdeaEditable: true,
      isIdeaEditMode: false,
      isIdeaPrivate: true
    },

    chips: [],
    ideaTags: [],
    tagsToRemove: [],
    loadingIdea: false,

    editIdeaAllowed: false,
    ideaOwnerId: null,
    loggedInUserId: null,

    snackbarVisible: false,
    snackbarMessage: '',
    snackbarColor: 'success',
    noAddComment: true,
    commentList: [],
    isIdeaLiked: false,
    // commentId: null,
    currentComment: '',
    updatingComment: false,

    showEmailShareDialog: false,
    showSaveIdeaMobileViewDailog: false,
    savedIdeaConformDailog: false,
    privateIdeaDailog: false,
    saveIdeaFromEmailDialog: false,
    showSaveIdeaDailog: false,
    showcommentDialog: false,
    commentForm: {
      Email: ''
    },
    dialog: false,
    emailShareForm: {
      name: '',
      friendName: '',
      friendEmail: ''
    },
    updatingIdea: false,
    ideaEditorVisible: false,
    ideaEditContents: ''
  }),
  computed: {
    mobileTitle: function() {
      return this.user.email.toUpperCase() + "'S IDEA"
    }
  },
  async asyncData({ app, route, store }) {
    const { data } = await app.$amplifyApi.graphql({
      query: getUsersIdea,
      variables: {
        userId: route.params.userId,
        ideaId: route.params.ideaId
      },
      authMode: 'API_KEY'
    })
    console.log('idea data: ', data)

    let isLiked = await app.$amplifyApi.graphql(
      graphqlOperation(getIsIdeaLikedByMe, { ideaId: route.params.ideaId })
    )

    const tag = await app.$amplifyApi.graphql(
      graphqlOperation(getIdeaTags, { ideaId: route.params.ideaId })
    )

    const result = await app.$amplifyApi.graphql(
      graphqlOperation(getComments, { ideaId: route.params.ideaId, limit: 10 })
    )

    let ideaTags = []
    for (let i = 0; i < tag.data.ideaTags.length; i++) {
      ideaTags.push(tag.data.ideaTags[i].tag)
    }

    let editIdeaAllowed = false
    if (route.params.userId == store.getters['cognito/userSub']) {
      editIdeaAllowed = true
    }
    return {
      idea: data.getUsersIdea,
      user: { email: store.state.cognito.user.attributes.email },
      ideaTags: ideaTags,
      isIdeaLiked: isLiked.data.getIsIdeaLikedByMe.isLiked,
      commentList: result.data.getComments.items,
      nextToken: result.data.getComments.nextToken,

      ideaOwnerId: route.params.userId,
      loggedInUserId: store.getters['cognito/userSub'],
      editIdeaAllowed: editIdeaAllowed
    }
  },

  mounted() {},

  created() {
    this.idea.relativeCreatedTime = dayjs(this.idea.createdDate).fromNow()
    this.mobileHeaderUiOptions.pageTitle = "Bob's Idea"
    this.mobileHeaderUiOptions.isIdeaEditable = this.editIdeaAllowed
    console.log(
      'deaowner id ',
      this.ideaOwnerId,
      'logged in user id',
      this.loggedInUserId,
      this.editIdeaAllowed
    )
  },

  methods: {
    async saveIdeaForUserDialog() {
      this.savedIdeaConformDailog = true
      this.showSaveIdeaDailog = false
    },

    showShareIdeaDialog() {
      this.showEmailShareDialog = true
    },

    async sendShareEmail() {
      //Validate input fields
      this.saveIdeaFromEmailDialog = true
      this.showEmailShareDialog = false

      let result = await this.$validator.validateAll()
      if (!result) {
        return
      }

      //TODO: Send email from backend

      this.snackbarMessage = 'Email sent successfully.'
      this.showEmailShareDialog = false
      this.snackbarVisible = true
    },

    async loadMoreComments() {
      this.loadingIdea = true
      if (!this.nextToken) {
        return
      }
      const result = await this.$amplifyApi.graphql(
        graphqlOperation(getComments, {
          ideaId: this.$route.params.ideaId,
          limit: 10,
          nextToken: this.nextToken
        })
      )

      // add next batch comment list into the existing comment array
      this.commentList = this.commentList.concat(result.data.getComments.items)
      // set nextToken for the next batch of comments
      this.nextToken = result.data.getComments.nextToken

      this.loadingIdea = false
    },

    async deleteComment(commentId, body, index) {
      try {
        await this.$amplifyApi.graphql(
          graphqlOperation(deleteComment, {
            // body: body,
            // userId: this.$store.getters['cognito/userSub'],
            ideaId: this.$route.params.ideaId,
            ideaOwnerId: this.$route.params.userId,
            commentId: commentId
          })
        )

        // remove comment form comment list array
        this.commentList.splice(index, 1)

        this.snackbarMessage = 'Deleted Comment'
        this.snackbarColor = 'success'
        this.snackbarVisible = true
        this.currentComment = ''
      } catch (err) {
        console.error(err)

        this.snackbarMessage = 'Something went wrong!!'
        this.snackbarColor = 'error'
        this.snackbarVisible = true
      }
    },

    copyShareLink() {
      this.$clipboard(window.location.href)
      this.snackbarMessage = 'Link copied'
      this.snackbarColor = 'success'
      this.snackbarVisible = true
    },

    async addCommentBox() {
      this.updatingComment = true

      try {
        debugger
        const result = await this.$amplifyApi.graphql(
          graphqlOperation(addComment, {
            body: this.currentComment,
            ideaId: this.$route.params.ideaId,
            userId: this.$store.getters['cognito/userSub'],
            ideaOwnerId: this.$route.params.userId
          })
        )
        this.commentList.push(result.data.addComment.comment)

        // this.fetchCommentList()
        this.updatingComment = false
        this.snackbarMessage = 'Added Comment'
        this.snackbarColor = 'success'
        this.snackbarVisible = true
        this.currentComment = ''
      } catch (err) {
        console.error(err)
        this.updatingComment = false
        this.snackbarMessage = 'Something went wrong!!'
        this.snackbarColor = 'error'
        this.snackbarVisible = true
      }
    },

    removeTag(item) {
      this.ideaTags.splice(this.ideaTags.indexOf(item), 1)
      this.ideaTags = [...this.ideaTags]
      this.tagsToRemove.push(item)
    },

    showIdeaEditor() {
      this.ideaEditContents = this.idea.content
      this.ideaEditorVisible = true
    },

    async toggleLikeIdea() {
      this.isIdeaLiked = !this.isIdeaLiked

      // Increase decrease like counter
      if (this.isIdeaLiked) this.idea.likesCount++
      else this.idea.likesCount--

      try {
        let ideaId = this.$route.params.ideaId
        let mutationToCall = this.isIdeaLiked ? likeIdea : unlikeIdea
        await this.$amplifyApi.graphql(
          graphqlOperation(mutationToCall, {
            ideaId: ideaId,
            ideaOwnerId: this.$route.params.userId
          })
        )
      } catch (err) {
        console.error(err)
        this.snackbarMessage = 'Something went wrong!!'
        this.snackbarColor = 'error'
        this.snackbarVisible = true
      }
    },

    async deleteIdea() {
      try {
        let ideaId = this.$route.params.ideaId
        await this.$amplifyApi.graphql(
          graphqlOperation(deleteIdea, {
            ideaId: ideaId
          })
        )

        this.snackbarMessage = 'Idea deleted'
        this.snackbarColor = 'success'
        this.snackbarVisible = true

        this.$router.push({
          name: 'ideas',
          force: true
        })
      } catch (err) {
        console.error(err)
        this.snackbarMessage = 'Something went wrong!!'
        this.snackbarColor = 'error'
        this.snackbarVisible = true
      }
    },

    async onSaveIdeaContent() {
      let result = await this.$validator.validateAll()

      this.errorMsg = ''
      if (!result) {
        this.errorMsg = 'This field is required.'
        return
      }
      this.updatingIdea = true

      try {
        // save content
        await this.$amplifyApi.graphql(
          graphqlOperation(updateIdea, {
            ideaId: this.$route.params.ideaId,
            content: this.idea.content,
            title: this.idea.title
          })
        )

        // save tags
        let tagsToSave = []
        for (let i = 0; i < this.ideaTags.length; i++) {
          tagsToSave.push({
            tag: this.ideaTags[i],
            ideaId: this.$route.params.ideaId
          })
        }
        await this.$amplifyApi.graphql(
          graphqlOperation(addTags, {
            tags: tagsToSave
          })
        )

        //delete Tag
        for (let i = 0; i < this.tagsToRemove.length; i++) {
          await this.$amplifyApi.graphql(
            graphqlOperation(deleteTag, {
              tag: {
                ideaId: this.$route.params.ideaId,
                tag: this.tagsToRemove[i]
              }
            })
          )
        }

        this.updatingIdea = false
        this.ideaEditorVisible = false
        this.snackbarMessage = 'Idea Updated'
        this.snackbarColor = 'success'
        this.snackbarVisible = true

        // Fetch tags
        const tag = await this.$amplifyApi.graphql(
          graphqlOperation(getIdeaTags, { ideaId: this.$route.params.ideaId })
        )

        this.ideaTags = []
        for (let i = 0; i < tag.data.ideaTags.length; i++) {
          this.ideaTags.push(tag.data.ideaTags[i].tag)
        }
      } catch (err) {
        console.error(err)
        this.updatingIdea = false
        this.snackbarMessage = 'Something went wrong!!'
        this.snackbarColor = 'error'
        this.snackbarVisible = true
      }
    }
  }
}
</script>

<style lang="scss">
#ideaDetailPage {
  background: #ebe7ed;
  padding-bottom: 2vh;
  width: 100%;
  overflow-x: hidden;
  position: relative;
  min-height: 90vh;

  @media #{$small-screen} {
    padding-right: 0%;
    padding-left: 0%;
  }

  .backgroundLamp {
    position: absolute;
    left: -10%;
    top: 25vh;
    width: 20%;
    z-index: 0;

    @media #{$small-screen} {
      left: 60%;
      top: 15vh;
      width: 80%;
      z-index: 0;
    }
  }

  .profileDetails {
    padding: 20px;
    padding-top: 0px;
    background: white;
    border-top: 1px solid #ebe7ed;

    @media #{$small-screen} {
      border-top: none;
      padding-top: 3vh;
    }

    .desktopHeader {
      height: auto !important;

      // Adjust mobile menubar padding
      .v-toolbar__content {
        padding: 0px 0px !important;
        margin: 10px 0px !important;
      }

      // Make page title aligned to center
      .pageTitle {
        width: 100%;
      }

      .editIdeaButton {
        margin: 0px !important;
        i {
          margin: 0px !important;
        }
      }

      .bookmarkIdeaButton {
        margin-top: -40px;
        // margin-right: -10px;
      }
    }

    .ideaTitle {
      padding-bottom: 10px;
      font-size: 30px;
      color: #18141c;
      word-wrap: auto;
      word-break: break-all;
      text-align: left;

      @media #{$small-screen} {
        // display: none;
        margin-top: 10px;
      }
    }

    .editIdeaTitle {
      padding-top: 28px;
      padding-bottom: 0px;
    }

    .metadata {
      font-size: 14px;
      color: #b5b5b5;

      .circle {
        color: #ebe8ee;
        font-size: 14px;
      }

      .timing {
        float: right;
        padding-right: 5px;
      }
    }

    .ideaDescription {
      margin-top: 20px;
      color: #827c85;
      line-height: 1.7;
      letter-spacing: 0.5px;

      @media #{$small-screen} {
        padding-top: 20px;
      }
    }

    .ideaEditor {
      margin-top: 20px;

      .editor {
        .trix-content {
          height: 170px !important;
          max-height: 200px !important;
          overflow-y: auto;
        }

        @media #{$small-screen} {
          font-size: 10px;

          .trix-content {
            height: 170px !important;
            max-height: 200px !important;
            overflow-y: auto;
          }
        }
      }
    }

    .nextPreviousIdeasButton {
      display: block;
      float: right;
      margin-right: 10px;

      @media #{$small-screen} {
        display: none;
      }

      .arrowBtn {
        .leftBtn {
          i {
            font-size: 16px;
          }
        }
      }
    }

    .errorMsg {
      color: #b71c1c;
      font-size: 12px;
      margin-top: 2px;
      padding-left: 10px;
    }

    .engagement-nextPrev {
      display: flex;
      margin-top: 15px;

      .engagement {
        flex: 1;
        padding-top: 12px;
        margin-bottom: 5px;
        padding-left: 5px;

        font-size: 18px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        letter-spacing: normal;
        text-align: left;
        color: #c0b7c5;

        .downs {
          margin-left: 25px;
        }

        div {
          display: inline-block;
          margin-right: 10px;
        }

        img {
          height: 14px;
          margin-right: 5px;
        }

        img,
        .lamp {
          margin-right: 2px;
        }
      }

      .nextPrev {
        flex: 1;

        .arrowBtn {
          display: inline-block;

          i {
            font-size: 18px;
          }
        }
      }
    }
  }

  .rightSideComments {
    padding-right: 10px;
    padding-left: 10px;
    padding-top: 15px;
    padding-bottom: 50px;
    font-size: 16px;
    min-height: 50vh;

    .cmtAndLike {
      color: #231031;
      display: flex;
      font-weight: bold;
      padding: 10px 15px 0px 15px;

      .ups {
        flex: 1;
      }
    }

    .downs {
      flex: 1;
      text-align: right;
    }

    img {
      display: inline-block;
      height: 16px;
      padding-top: 2px;
      margin-right: 5px;
    }

    .noCommentDiv {
      min-height: 70vh;
      padding-top: 34vh;
      text-align: center;
      color: #c0b7c5;
      font-size: 25px;
    }
  }

  .commentTotal {
    padding: 25px 0px 10px 15px;

    font-size: 14px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.57;
    letter-spacing: 0.42px;
    color: #232323;
  }

  .commentItem {
    margin: 15px;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 0px 7px 7px 7px;

    @media #{$small-screen} {
      border-left: 0px;
      border-right: 0px;
      border-bottom: none;
      margin-top: 0px;
    }

    .header {
      .commentUser {
        padding-bottom: 3px;
        display: inline-block;

        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.83;
        letter-spacing: normal;
        text-align: left;
        color: #b5b5b5;
      }

      .timing {
        float: right;
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        // line-height: 1.83;
        letter-spacing: normal;
        text-align: right;
        color: #c0b7c5;
      }
    }

    .commentText {
      width: 100%;
      display: block;

      @media #{$small-screen} {
        padding-top: 3px;
      }

      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.57;
      letter-spacing: normal;
      text-align: left;
      color: #827c85;
    }

    .deleteCommentBtn {
      display: block;
      margin-right: -20px;
      margin-top: 7px;

      i {
        font-size: 13px !important;
      }
    }
  }
}

.loadMoreBtn {
  text-align: center;
  margin-bottom: 20px;
  margin-top: 10px;
}

.pageFooter {
  position: fixed;
  width: 100%;
  bottom: -5px;

  background: white;
  z-index: 100;
  height: 13vh;
  background-color: #ffffff;

  .leftSideTagsSection {
    border-top: 1px solid #ebe7ed;
    padding-left: 10px;

    .tagsContainer {
      margin-top: 20px;

      .tag {
        margin: 0px 2px 10px 2px;
        border-radius: 6px;
        background-color: rgba(192, 183, 197);
        color: white;
      }
    }

    .tagsEditor {
      margin-top: 40px;

      .ideaTag {
        .v-chip {
          background-color: rgba(192, 183, 197);
          color: white;

          i {
            color: white;
          }
        }

        .v-input__append-inner {
          display: none;
        }
      }

      .v-icon.mdi-menu-down {
        display: none;
      }
    }
  }

  .rightSideNewCommentSection {
    border-left: 1px solid #ebe7ed;
    box-shadow: 0 -10px 10px 0 rgba(228, 228, 228, 0.73);
    .newCommentInput {
      .v-input__control {
        min-height: 13vh;
      }
      .v-input__slot {
        margin-bottom: 0px;
      }
    }

    .sendBtn {
      position: absolute;
      top: 5vh;
      right: 19px;
      font-size: 21px;

      .v-icon {
        padding-bottom: 5px;
      }
    }
  }
}
</style>
