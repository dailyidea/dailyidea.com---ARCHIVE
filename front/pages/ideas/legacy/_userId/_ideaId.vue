<template>
  <Layout
    v-bind="{
      currentPage: 'IdeaDetail',
      pageOptions: mobileHeaderUiOptions
    }"
    @showShareIdeaDialog="showShareIdeaDialog"
    @toggleIdeaPrivacy="toggleIdeaPrivacy"
    @toggleIdeaEditor="toggleIdeaEditor"
    @toggleIdeaBookmarked="onCopyShareLink"
    @onCopyShareIdeaLink="onCopyShareLink"
  >
    <v-row id="ideaDetailPage" no-gutters>
      <!-- Left Side Idea Information -->
      <v-col cols="12" sm="6" class="profileDetails">
        <!-- Header section - only for desktop -->
        <v-toolbar color="white" flat class="desktopHeader hidden-sm-and-down">
          <v-toolbar-title class="pageTitle">
            <template v-if="!isIdeaEditable">
              <router-link
                :to="{
                  name: 'ideas-userSlug',
                  params: {
                    userSlug: idea.authorSlug
                  }
                }"
                >{{ idea.authorName }}</router-link
              >'s Idea
            </template>
            <v-btn
              v-else
              :class="{ lightPinkButton: !ideaEditorVisible }"
              rounded
              outlined
              class="editIdeaButton"
              @click="toggleIdeaEditor"
            >
              My Idea &nbsp;
              <v-icon left>mdi-pencil</v-icon>
            </v-btn>
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <!-- Public Private Idea buttons -->
          <v-btn
            v-if="isIdeaEditable && idea.isPrivate"
            text
            icon
            color="gray"
            class="publicPrivateIdeaButton"
            @click="toggleIdeaPrivacy"
          >
            <img class="privateIdea" src="~/assets/images/privateIdea.png" />
          </v-btn>
          <v-btn
            v-else-if="isIdeaEditable"
            text
            icon
            color="gray"
            class="publicPrivateIdeaButton"
            @click="toggleIdeaPrivacy"
          >
            <img class="publicIdea" src="~/assets/images/publicIdea.png" />
          </v-btn>

          <!-- Bookmark button -->

          <save-idea-bookmark
            @savedStateChanged="onIdeaSaveStateChanged"
          ></save-idea-bookmark>

          <!-- Desktop Settings Menu -->
          <v-btn icon @click.native="showShareIdeaDialog">
            <v-icon>share</v-icon>
          </v-btn>
        </v-toolbar>

        <div v-if="!ideaEditorVisible" class="ideaTitle">
          {{ idea.title }}
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
          <!--          <span>-->
          <!--            <v-icon class="circle">mdi-checkbox-blank-circle</v-icon>-->
          <!--            &nbsp; dummy@missing_field.com-->
          <!--          </span>-->
          <span class="timing">{{ idea.createdDate | toRelativeDate }}</span>
        </div>

        <!-- Description -->
        <div v-if="!ideaEditorVisible" class="ideaDescription">
          <idea-content :content="idea.content"></idea-content>
        </div>

        <div v-else class="ideaEditor">
          <client-only>
            <trix-wrapper
              v-model="ideaEditContents"
              class="editor"
              placeholder="Enter content"
            />
          </client-only>
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
        <div v-if="ideaEditorVisible" class="saveCancelButtons">
          <v-btn
            small
            color="primary"
            :loading="updatingIdea"
            @click="onSaveIdeaContent"
            >Save</v-btn
          >
          <v-btn text small color="error" @click="toggleIdeaEditor"
            >Cancel</v-btn
          >
        </div>

        <!-- Mobile Only - Engagements & Next Prev -->
        <v-layout class="engagement-nextPrev" hidden-md-and-up>
          <v-layout class="cmtAndLikeCounters">
            <!-- Like/Unlike Button -->
            <v-btn
              text
              class="counterItem likesCounter"
              @click="toggleLikeIdea"
            >
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
              <div>{{ idea.likesCount ? idea.likesCount : '0' }}</div>
            </v-btn>
            <v-btn text disabled class="counterItem commentsCounter">
              <img class="cmt" src="~/assets/images/comments.png" />
              <div>{{ idea.commentsCount ? idea.commentsCount : '0' }}</div>
            </v-btn>
          </v-layout>

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
          <!-- Comment Statistics - Desktop Only -->
          <v-layout class="cmtAndLikeCounters" hidden-sm-and-down>
            <!-- Like/Unlike Button -->
            <v-btn
              text
              class="counterItem likesCounter"
              @click="toggleLikeIdea"
            >
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
              <div>{{ idea.likesCount ? idea.likesCount : '0' }}</div>
            </v-btn>

            <!-- Comments Count -->
            <v-btn text disabled class="counterItem commentsCounter">
              <img class="cmt" src="~/assets/images/comments.png" />
              <div>{{ idea.commentsCount ? idea.commentsCount : '0' }}</div>
            </v-btn>
          </v-layout>

          <!-- Comment List -->
          <div
            v-for="(item, index) in commentList"
            :key="index"
            class="commentItem"
          >
            <div class="header">
              <div class="commentUser">Name Surname</div>
              <div class="timing">
                00
                <v-btn
                  class="deleteCommentBtn"
                  color="red"
                  icon
                  text
                  x-small
                  @click="onDeleteComment(item.commentId, item.body, index)"
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

    <!-- Footer with textbox -->
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
              v-model="editIdeaTags"
              placeholder="Add tags here"
              :error-messages="errors.collect('tag')"
              data-vv-name="tag"
              class="ideaTag"
              hide-details
              times
              chips
              clearable
              outlined
              label=""
              multiple
            >
              <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip
                  v-bind="attrs"
                  :input-value="selected"
                  close
                  label
                  @click="() => {}"
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
              :disabled="!currentComment || currentComment.length == 0"
              flat
              :loading="showAddCommentLoader"
              @click="onAddComment()"
            >
              <v-icon color="#d4bb10">fas fa-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Bottom snackbar message -->
    <visual-notifier ref="notifier"></visual-notifier>

    <CommentWithoutLoginDialog
      :visible.sync="showCommentWithoutLoginDialog"
      @close="showCommentWithoutLoginDialog = false"
    ></CommentWithoutLoginDialog>

    <SubsribeForPrivateIdeaDialog
      :visible.sync="showSubscribeForPrivateIdeaDialog"
      @close="showSubscribeForPrivateIdeaDialog = false"
    ></SubsribeForPrivateIdeaDialog>
    <ShareIdeaByEmailDialog
      :idea-id="$route.params.ideaId"
      :idea-owner-id="$route.params.userId"
      :visible="showEmailShareDialog"
      @success="onSharedIdeaOverEmail"
      @error="onSharedIdeaOverEmailError"
      @close="showEmailShareDialog = false"
      @onCopyShareLink="onCopyShareLink"
    ></ShareIdeaByEmailDialog>
  </Layout>
</template>

<script>
// JUST in case I've forgotten something. let it be for now. #FIXME Delete this file later
import { graphqlOperation } from '@aws-amplify/api'
import CommentWithoutLoginDialog from '@/components/dialogs/commentWithoutLogin'
import IdeaContent from '~/components/IdeaContent'

import SubsribeForPrivateIdeaDialog from '@/components/dialogs/subscribeForPrivateIdea'
import ShareIdeaByEmailDialog from '@/components/dialogs/shareIdeaByEmail'
import SaveIdeaBookmark from '@/components/ideaDetail/SaveIdeaBookmark'
import TrixWrapper from '@/components/TrixWrapper'
import VisualNotifier from '~/components/VisualNotifier'

// import getIsIdeaLikedByMe from '~/graphql/query/getIsIdeaLikedByMe'
import updateIdea from '~/graphql/mutations/updateIdea'
import addComment from '~/graphql/mutations/addComment'
import deleteComment from '~/graphql/mutations/deleteComment'
import getIdeaTags from '~/graphql/query/getIdeaTags'
import getComments from '~/graphql/query/getComments'
import Layout from '@/components/layout/Layout'
// import userInfo from '~/graphql/query/userInfo'
import deleteIdea from '~/graphql/mutations/deleteIdea'
import getUsersIdea from '~/graphql/query/getUsersIdea'

export default {
  components: {
    Layout,
    CommentWithoutLoginDialog,
    SubsribeForPrivateIdeaDialog,
    ShareIdeaByEmailDialog,
    TrixWrapper,
    SaveIdeaBookmark,
    VisualNotifier,
    IdeaContent
  },
  $_veeValidate: {
    validator: 'new'
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

    let isIdeaEditable = false
    if (
      store.getters['cognito/isLoggedIn'] &&
      route.params.userId === store.getters['cognito/userSub']
    ) {
      isIdeaEditable = true
    }
    return {
      idea: data.getUsersIdea,
      ideaTags: [],
      commentList: [],
      nextToken: undefined,

      ideaOwnerId: route.params.userId,
      isIdeaEditable
    }
  },
  data: () => ({
    mobileHeaderUiOptions: {
      pageTitle: "Bob's Idea",
      leftButtonType: 'back',
      isIdeaBookmarked: false,
      isIdeaEditable: false,
      ideaEditorVisible: false,
      isIdeaPrivate: true
    },

    chips: [],
    ideaTags: [],
    editIdeaTags: [],
    loadingIdea: false,

    // Idea Editor
    isIdeaEditable: false,
    ideaOwnerId: null,
    updatingIdea: false,
    ideaEditorVisible: false,
    ideaEditContents: '',

    // Comments Section
    commentList: [],
    isIdeaLiked: false,
    currentComment: '',
    showAddCommentLoader: false,

    // Variables for dialogs
    showCommentWithoutLoginDialog: false,
    showSaveWithoutLoginDialog: false,
    showSubscribeForPrivateIdeaDialog: false,
    showEmailShareDialog: false
  }),

  mounted() {
    this.loadSecondaryData()
  },

  created() {
    this.mobileHeaderUiOptions.pageTitle = "Bob's Idea"
    this.mobileHeaderUiOptions.isIdeaEditable = this.isIdeaEditable
  },

  methods: {
    toggleLikeIdea() {},
    saveIdeaForUserDialog() {
      this.savedIdeaConformDailog = true
      this.showSaveIdeaDailog = false
    },

    showShareIdeaDialog() {
      this.showEmailShareDialog = true
    },

    onSharedIdeaOverEmail() {
      this.$refs.notifier.success('Idea shared!')
    },
    onSharedIdeaOverEmailError() {
      this.$refs.notifier.error("Can't share Idea")
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

    // Share Link to clipboard
    onCopyShareLink() {
      this.$refs.notifier.success('Link copied')
    },

    // Delete Comments
    async onDeleteComment(commentId, body, index) {
      try {
        await this.$amplifyApi.graphql(
          graphqlOperation(deleteComment, {
            // body: body,
            // userId: this.$store.getters['cognito/userSub'],
            ideaId: this.$route.params.ideaId,
            ideaOwnerId: this.$route.params.userId,
            commentId
          })
        )

        // remove comment form comment list array
        this.commentList.splice(index, 1)
        this.idea.commentsCount -= 1

        this.currentComment = ''
        this.$refs.notifier.success('Deleted Comment')
      } catch (err) {
        this.$refs.notifier.error('Something went wrong!!')
      }
    },

    // Add Comments
    async onAddComment() {
      // IF user has not logged in, show comment without login dialog
      if (!this.$store.getters['cognito/isLoggedIn']) {
        this.showCommentWithoutLoginDialog = true
        return
      }

      this.showAddCommentLoader = true

      try {
        const result = await this.$amplifyApi.graphql(
          graphqlOperation(addComment, {
            body: this.currentComment,
            ideaId: this.$route.params.ideaId,
            userId: this.$store.getters['cognito/userSub'],
            ideaOwnerId: this.$route.params.userId
          })
        )
        this.commentList.push(result.data.addComment.comment)
        this.idea.commentsCount += 1

        // this.fetchCommentList()
        this.showAddCommentLoader = false
        this.$refs.notifier.success('Added Comment')
        this.currentComment = ''
      } catch (err) {
        this.showAddCommentLoader = false
        this.$refs.notifier.error('Something went wrong!!')
      }
    },

    // Private/Public Idea
    toggleIdeaPrivacy() {
      this.showSubscribeForPrivateIdeaDialog = true
    },

    onIdeaSaveStateChanged({ liked, likesCount }) {
      this.$refs.notifier.success(liked ? 'Liked' : 'Unliked')
    },

    // Delete Idea
    async onDeleteIdea() {
      try {
        const ideaId = this.$route.params.ideaId
        await this.$amplifyApi.graphql(
          graphqlOperation(deleteIdea, {
            ideaId
          })
        )

        this.$refs.notifier.success('Idea deleted')

        this.$router.push({
          name: 'ideas',
          force: true
        })
      } catch (err) {
        this.$refs.notifier.error('Something went wrong!!')
      }
    },

    // Show editable idea input
    toggleIdeaEditor() {
      if (this.ideaEditorVisible) {
        this.ideaEditorVisible = false
      } else {
        this.ideaEditContents = this.idea.content
        this.editIdeaTags = this.ideaTags.map(t => t)
        this.ideaEditorVisible = true
      }
      this.mobileHeaderUiOptions.ideaEditorVisible = this.ideaEditorVisible
    },

    // Edit Idea Mode - remove ccomment from array
    removeTag(item) {
      this.editIdeaTags.splice(this.editIdeaTags.indexOf(item), 1)
    },

    // On Save Idea
    async onSaveIdeaContent() {
      const result = await this.$validator.validateAll()

      this.errorMsg = ''
      if (!result) {
        this.errorMsg = 'This field is required.'
        return
      }
      this.updatingIdea = true
      setTimeout(async () => {
        try {
          await this.$amplifyApi.graphql(
            graphqlOperation(updateIdea, {
              ideaId: this.$route.params.ideaId,
              ideaOwnerId: this.$route.params.userId,
              content: this.ideaEditContents,
              title: this.idea.title,
              tags: this.editIdeaTags
            })
          )
          this.idea.content = this.ideaEditContents
          this.ideaTags = this.editIdeaTags
          this.updatingIdea = false
          this.ideaEditorVisible = false
          this.mobileHeaderUiOptions.ideaEditorVisible = false

          this.$refs.notifier.success('Idea Updated')
        } catch (err) {
          this.updatingIdea = false
          this.$refs.notifier.error('Something went wrong!!')
        }
      }, 10) // if last tag not saved yet editor needs time to process outer click event
    },
    async loadIdeaTags() {
      const ideaTags = []
      if (this.$store.getters['cognito/isLoggedIn']) {
        const tag = await this.$amplifyApi.graphql({
          query: getIdeaTags,
          variables: {
            ideaId: this.$route.params.ideaId
          }
        })

        for (let i = 0; i < tag.data.ideaTags.length; i++) {
          ideaTags.push(tag.data.ideaTags[i].tag)
        }
      }
      this.ideaTags = ideaTags
    },
    async loadComments() {
      const result = await this.$amplifyApi.graphql({
        query: getComments,
        variables: {
          ideaId: this.$route.params.ideaId,
          limit: 10
        },
        authMode: 'API_KEY'
      })
      this.commentList = result.data.getComments.items
    },
    loadSecondaryData() {
      this.loadComments()
      this.loadIdeaTags()
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
  padding-bottom: 80px;

  blockquote {
    margin: 0 0 0 0.3em;
    padding: 0 0 0 0.6em;
    border-left: 0.3em solid #ccc;
  }

  @media #{$small-screen} {
    padding-right: 0%;
    padding-left: 0%;
    padding-bottom: 0px !important;
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
        /*width: 100%;*/
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

      .publicPrivateIdeaButton {
      }
    }

    .ideaTitle {
      padding-bottom: 10px;
      font-size: 24px;
      color: #18141c;
      word-wrap: auto;
      word-break: break-word;
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
      word-break: break-word;

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

      .cmtAndLikeCounters {
        color: #231031;
        padding: 7px 15px 0px 0px;

        display: flex;

        $height: 15px;

        .counterItem {
          display: inline-flex;
          img {
            flex: 1;
            height: $height;
            margin-right: 7px;
          }

          div {
            flex: 1;
            font-size: $height;
            line-height: $height + 2;
            width: auto;
          }
        }

        .commentsCounter {
          margin-left: 0px;
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

    .saveCancelButtons {
      // border: 1px solid red;
      padding-top: 5px;
    }
  }

  .rightSideComments {
    padding-right: 10px;
    padding-left: 10px;
    padding-top: 15px;
    font-size: 16px;
    min-height: 50vh;

    .cmtAndLikeCounters {
      color: #231031;
      padding: 7px 15px 0px 15px;
      width: 100%;
      display: flex;

      $height: 15px;

      .counterItem {
        display: inline-flex;
        img {
          flex: 1;
          height: $height;
          margin-right: 7px;
        }

        div {
          flex: 1;
          font-size: $height;
          line-height: $height + 2;
          width: auto;
        }
      }

      .likesCounter {
      }

      .commentsCounter {
        margin-left: auto;
      }
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
          display: inline-block;

          font-size: 12px;
          line-height: 28px;
          color: #b5b5b5;
        }

        .timing {
          float: right;
          font-size: 12px;
          text-align: right;
          color: #c0b7c5;
        }
      }

      .commentText {
        width: 100%;

        @media #{$small-screen} {
          padding-top: 3px;
        }

        font-size: 14px;
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

    .noCommentDiv {
      min-height: 70vh;
      padding-top: 34vh;
      text-align: center;
      color: #c0b7c5;
      font-size: 25px;
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

  @media #{$small-screen} {
    height: 11vh;
    bottom: 5px;
  }

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
      fieldset {
        border: none !important;
      }
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
