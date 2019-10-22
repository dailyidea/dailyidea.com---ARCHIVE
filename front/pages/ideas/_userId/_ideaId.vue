<template>
  <Layout
    v-bind="{
      backButton: true,
      loggedInHeader: true,
      mobile: mobileTitle,
      shareIdeaVisible: true,
      editIdeaVisible: true,
      showEditIdeaBtn: true,
      showSaveActionBtn: true,
      showUnSaveActionBtn: true,
      showPrivateIdeaBtn: true,
      onCopyShareIdeaLink: copyShareLink
    }"
    @showShareIdeaDialog="showShareIdeaDialog"
    @showSaveIdeaForMobileDailog="showSaveIdeaMobileViewDailog = true"
    @showPrivateIdeaDailog="privateIdeaDailog = true"
    @onEditIdea="showIdeaEditor"
  >
    <v-layout id="ideaDetailPage">
      <img class="backgroundLamp" src="~/assets/images/light_gray_lamp.png" />

      <v-flex class="profileDetails">
        <!-- Header section - only for desktop -->
        <v-layout class="sectionHeader" hidden-sm-and-down>
          <!-- Edit IDea Button-->
          <v-btn
            outlined
            rounded
            color="gray"
            class="editIdeaBtn"
            @click="showIdeaEditor()"
          >
            MY IDEA <v-icon right>fas fa-pen</v-icon>
          </v-btn>

          <div class="headerRightSide">
            <v-btn text icon color="gray" class="globeImageDiv">
              <img
                alt="image"
                class="globeSmallImage"
                src="~/assets/images/globeSmallImage.png"
              />
            </v-btn>

            <v-btn
              text
              icon
              color="gray"
              class="globeImageDiv"
              @click="privateIdeaDailog = true"
            >
              <img
                alt="image"
                class="globeImage"
                src="~/assets/images/globeImage.png"
              />
            </v-btn>

            <v-btn text icon color="gray" class="saveIdeaBtn">
              <img
                class="saveIdea"
                src="~/assets/images/unSaveIdeaImage.png"
                @click="showSaveIdeaDailog = true"
              />
              <!-- <img class="unsaveIdea" src="~/assets/images/saveIdeaImage.png" /> -->
            </v-btn>

            <!-- Side Settings icon -->
            <v-menu class="sideMenu" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  icon
                  color="gray"
                  size="small"
                  class="menu"
                  v-on="on"
                >
                  <v-icon>fas fa-ellipsis-v</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title>Share</v-list-item-title>
                </v-list-item>
                <v-list-item @click="showEmailShareDialog = true">
                  <v-list-item-title>Share by Email</v-list-item-title>
                </v-list-item>
                <v-list-item @click="copyShareLink()">
                  <v-list-item-title>Copy Direct Link</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Report Idea</v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteIdea()">
                  <v-list-item-title>Delete Idea</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-layout>

        <!-- Idea title -->

        <!-- {{idea}} -->
        <div v-if="!ideaEditorVisible" class="ideaTitle">
          <div class="ideaTitle">{{ idea.title }}</div>
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
          <span>{{ user.email }}</span>
          <span class="timing">{{ idea.relativeCreatedTime }}</span>
        </div>

        <!-- Description -->
        <div v-if="!ideaEditorVisible" class="ideaDescription">
          <v-layout v-html="idea.content"> </v-layout>
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

        <div class="headerLeftSideOfDesktop">
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
      </v-flex>

      <!-- Comments -->
      <v-flex v-if="!noComment" class="rightSideComments">
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
      </v-flex>
      <div v-else class="noCommentDiv">
        <div>
          No added Comment yet.
        </div>
      </div>

      <!-- Foter with textbox -->
      <div class="pageFooter">
        <v-text-field
          v-model="currentComment"
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

        <v-dialog
          v-model="showcommentDialog"
          content-class="commentDialog"
          persistent
          max-width="500px"
        >
          <!-- Popup Header -->
          <div class="header">
            <v-icon
              text
              class="cancelIcon"
              size="20"
              @click="showcommentDialog = false"
              >fas fa-times</v-icon
            >
          </div>

          <!-- Popup body -->
          <form>
            <div class="body">
              <div class="headlineText1">
                Oops,
              </div>
              <div class="headlineText2">
                Verify your emailor signin to post your comment.
              </div>

              <!-- Text Fields -->
              <div>
                <v-text-field
                  v-model="commentForm.Email"
                  v-validate="'required|email|max:100'"
                  class="emailInput"
                  single-line
                  flat
                  prepend-inner-icon="email"
                  :error-messages="errors.collect('email')"
                  data-vv-name="email"
                  label="Enter email"
                ></v-text-field>
              </div>

              <!-- Submit Buttons -->
              <div class="specialButton submitBtn">
                <v-btn>SEND</v-btn>
              </div>
            </div>
          </form>
        </v-dialog>
      </div>

      <!-- Popup - Share Via Email -->
      <v-dialog
        v-model="showEmailShareDialog"
        content-class="emailShareDialog"
        persistent
        max-width="400px"
      >
        <div class="closeBtn">
          <v-icon
            text
            class="cancelIcon"
            size="18"
            @click="showEmailShareDialog = false"
            >fas fa-times</v-icon
          >
        </div>
        <form>
          <!-- Popup Header -->

          <div class="header">
            <v-icon text class="shareIcon" size="50">fas fa-envelope</v-icon>

            <div class="headlineText">
              Share Idea by Email
            </div>
          </div>

          <!-- Text Fields -->
          <div>
            <v-text-field
              v-model="emailShareForm.name"
              v-validate="'required|max:100'"
              :error-messages="errors.collect('name')"
              data-vv-name="name"
              label=" Your name"
              outlined
            >
            </v-text-field>
            <v-text-field
              v-model="emailShareForm.friendName"
              v-validate="'required|max:100'"
              :error-messages="errors.collect('friend name')"
              data-vv-name="friend name"
              label=" Your Friend's name"
              outlined
            ></v-text-field>

            <v-text-field
              v-model="emailShareForm.friendEmail"
              v-validate="'required|email|max:100'"
              append-icon="email"
              :error-messages="errors.collect('email')"
              data-vv-name="email"
              label="Your Friend's email "
              outlined
            ></v-text-field>
          </div>

          <!-- Submit Buttons -->
          <div class="btnContainer">
            <v-btn class="cancleBtn" text @click="showEmailShareDialog = false"
              >Cancel</v-btn
            >
            <v-btn class="specialButton shareBtn" @click="sendShareEmail()"
              >Share</v-btn
            >
          </div>
        </form>
      </v-dialog>

      <!-- Popup - Save Idea from Email -->
      <v-dialog
        v-model="saveIdeaFromEmailDialog"
        content-class="saveIdeaEmailDialog"
        persistent
        max-width="420px"
      >
        <div class="closeBtn">
          <v-icon
            text
            class="cancelIcon"
            size="20"
            @click="saveIdeaFromEmailDialog = false"
            >fas fa-times</v-icon
          >
        </div>

        <form>
          <div class="bulbImageSection">
            <img
              alt="image"
              class="bulbImage"
              src="~/assets/images/logo_icon.png"
            />
          </div>
          <!-- Popup Header -->
          <div class="header">
            <div class="headlineText">
              Someone shared an <br />
              Idea with you
            </div>
            <div class="subHeader">
              Daily Idea Lets you browse othre <br />people's ideas but also
              save your<br />
              own. What would you like to do?
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="btnContainer">
            <v-btn class="specialButton shareBtn">WRITE A NEW IDEA</v-btn>
          </div>
          <div class="btnContainer">
            <v-btn outlined class="browseBtn">SUBMIT A NEW IDEA</v-btn>
          </div>
          <div class="btnContainer">
            <v-btn outlined class="browseBtn">BROWSE PUBLIC IDEAS</v-btn>
          </div>
        </form>
      </v-dialog>

      <!-- Popup - Save Idea -->
      <v-dialog
        v-model="showSaveIdeaDailog"
        content-class="saveIdeaDialog"
        persistent
        max-width="500px"
      >
        <div class="closeBtn">
          <v-icon
            text
            class="cancelIcon"
            size="20"
            @click="showSaveIdeaDailog = false"
            >fas fa-times</v-icon
          >
        </div>
        <form>
          <!-- Popup Header -->
          <div class="headerInfo">
            <div class="saveIdeaDetail">
              <img
                alt="image"
                class="saveIdeaImage"
                src="~/assets/images/saveDailogMobile.png"
              />

              <div class="mainheader">Save Idea</div>
              <div class="subHeader">
                To save this idea and get back to it at any time, you need to
                create an account.Don't worry, all we need is your email.
              </div>
            </div>
          </div>

          <!-- Text Fields -->
          <div class="inputDetails">
            <v-text-field
              v-model="emailShareForm.name"
              v-validate="'required|max:100'"
              prepend-inner-icon="fas fa-user"
              single-line
              flat
              :error-messages="errors.collect('name')"
              data-vv-name="name"
              label="Enter your name"
            >
            </v-text-field>
            <v-text-field
              v-model="emailShareForm.friendEmail"
              v-validate="'required|email|max:100'"
              prepend-inner-icon="email"
              single-line
              flat
              :error-messages="errors.collect('email')"
              data-vv-name="email"
              label="Enter your email address"
            ></v-text-field>
          </div>

          <!-- Submit Buttons -->
          <div class="btnContainer">
            <v-btn
              class="specialButton shareBtn"
              @click="saveIdeaForUserDialog()"
              >Share</v-btn
            >
          </div>
        </form>
      </v-dialog>

      <!-- Popup - Save Idea conform Dailog-->
      <v-dialog
        v-model="savedIdeaConformDailog"
        content-class="saveIdeaConformDivDialog"
        persistent
        max-width="420px"
      >
        <div class="closeBtn">
          <v-icon
            text
            class="cancelIcon"
            size="20"
            @click="savedIdeaConformDailog = false"
            >fas fa-times</v-icon
          >
        </div>

        <form>
          <div class="bulbImageSection">
            <img
              alt="image"
              class="bulbImage"
              src="~/assets/images/logo_icon.png"
            />
          </div>
          <!-- Popup Header -->
          <div class="header">
            <div class="headlineText">
              Yay, You Saved <br />
              an Idea!
            </div>
            <div class="subHeader">
              Daily Idea Lets you browse othre <br />people's ideas but also
              save your<br />
              own. What would you like to do?
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="btnContainer">
            <v-btn class="specialButton shareBtn">WRITE A NEW IDEA</v-btn>
          </div>
          <div class="btnContainer">
            <v-btn outlined class="browseBtn">BROWSE PUBLIC IDEAS</v-btn>
          </div>
        </form>
      </v-dialog>

      <!-- Popup -Private Idea -->
      <v-dialog
        v-model="privateIdeaDailog"
        content-class="privateIdeaSectionDialog"
        persistent
        max-width="450px"
      >
        <div class="closeBtn">
          <v-icon
            text
            class="cancelIcon"
            size="18"
            @click="privateIdeaDailog = false"
            >fas fa-times</v-icon
          >
        </div>

        <form>
          <!-- Popup Header -->

          <div class="globeImageSection">
            <img
              alt="image"
              class="globeImage"
              src="~/assets/images/globeImage.png"
            />
          </div>
          <div class="header">
            <div class="headlineText">
              So You Want To Keep <br />
              Your Ideas to <br />
              Yourself ?
            </div>
            <div class="subHeader">
              That's ok. Some things do<br />
              need to stay private. Turn your <br />
              idea private with just a click for<br />
              only
            </div>
            <div class="rateSection">
              $ 2.99/mounth
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="btnContainer">
            <v-btn class="specialButton shareBtn">SUBSCRIBE</v-btn>
          </div>
        </form>
      </v-dialog>

      <!-- Popup - Save Idea For Mobile View  -->
      <v-dialog
        v-model="showSaveIdeaMobileViewDailog"
        content-class="saveIdeaMobileViewDialog"
        persistent
        max-width="350px"
      >
        <div class="closeBtn">
          <v-icon
            text
            class="cancelIcon"
            size="20"
            @click="showSaveIdeaMobileViewDailog = false"
            >fas fa-times</v-icon
          >
        </div>
        <form>
          <!-- Popup Header -->
          <div class="headerInfo">
            <div class="row saveIdeaDetail">
              <div class="col-md-0">
                <img
                  alt="image"
                  class="saveIdeaImage"
                  src="~/assets/images/saveDailogMobile.png"
                />
              </div>
              <div class="col-md-0">
                <div class="mainheader">Save Idea</div>
                <div class="subHeader">
                  To save this idea and get back to it at any time, you need to
                  create an account.Don't worry, all we need is your email.
                </div>
              </div>
            </div>
          </div>

          <!-- Text Fields -->
          <div class="inputDetails">
            <v-text-field
              v-model="emailShareForm.name"
              v-validate="'required|max:100'"
              prepend-inner-icon="fas fa-user"
              single-line
              flat
              :error-messages="errors.collect('name')"
              data-vv-name="name"
              label="Enter your name"
            >
            </v-text-field>
            <v-text-field
              v-model="emailShareForm.friendEmail"
              v-validate="'required|email|max:100'"
              prepend-inner-icon="email"
              single-line
              flat
              :error-messages="errors.collect('email')"
              data-vv-name="email"
              label="Enter your email address"
            ></v-text-field>
          </div>

          <!-- Submit Buttons -->
          <div class="btnContainer">
            <v-btn
              class="specialButton shareBtn"
              @click="saveIdeaForUserDialog()"
              >Share</v-btn
            >
          </div>
        </form>
      </v-dialog>

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
    </v-layout>
  </Layout>
</template>
<script>
import { graphqlOperation } from '@aws-amplify/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import getMyIdea from '~/graphql/query/getMyIdea'
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
// import getIdea from '~/graphql/query/getIdea'

dayjs.extend(relativeTime)

export default {
  components: { Layout },
  $_veeValidate: {
    validator: 'new'
  },
  data: () => ({
    chips: [],
    ideaTags: [],
    tagsToRemove: [],
    loadingIdea: false,

    snackbarVisible: false,
    snackbarMessage: '',
    snackbarColor: 'success',
    noAddComment: true,
    commentList: [],
    isIdeaLiked: false,
    // commentId: null,
    currentComment: '',
    updatingComment: false,
    noComment: false,

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
    // debugger
    const { data } = await app.$amplifyApi.graphql(
      graphqlOperation(getMyIdea, { ideaId: route.params.ideaId })
    )

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

    return {
      idea: data.getMyIdea,
      user: { email: store.state.cognito.user.attributes.email },
      ideaTags: ideaTags,
      isIdeaLiked: isLiked.data.getIsIdeaLikedByMe.isLiked,
      commentList: result.data.getComments.items,
      nextToken: result.data.getComments.nextToken
    }
  },

  mounted() {},

  created() {
    this.idea.relativeCreatedTime = dayjs(this.idea.createdDate).fromNow()
  },

  methods: {
    // async fetchCommentList() {
    //   const { data } = await this.$amplifyApi.graphql(
    //     graphqlOperation(getIdea, { ideaId: this.$route.params.ideaId })
    //   )

    //   this.commentList = data.getIdea.comments
    // },

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
            ideaOwnerId: this.idea.userId,
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
        const result = await this.$amplifyApi.graphql(
          graphqlOperation(addComment, {
            body: this.currentComment,
            ideaId: this.$route.params.ideaId,
            userId: this.$store.getters['cognito/userSub'],
            ideaOwnerId: this.idea.userId
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
            ideaOwnerId: this.idea.userId
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
  display: block;
  width: 100%;

  @media #{$small-screen} {
    width: 100%;
  }

  position: relative;

  .profileDetails {
    padding: 20px;
    background: white;
    overflow: auto;

    @media #{$small-screen} {
      // padding-right: 5%;
      // padding-left: 5%;
    }

    .sectionHeader {
      display: flex;
      margin-bottom: 20px;

      .editIdeaBtn {
        margin: 0px;
        color: #87818a !important;

        i {
          color: #87818a !important;
        }
      }

      i {
        line-height: 20px;
        font-size: 15px;
        color: #35124e;
      }

      .headerLeftSide {
        flex: 1;
      }

      .headerRightSide {
        flex: 1;
        text-align: right;

        .globeIcon {
          margin-right: 10px;
        }

        .globeImageDiv {
          margin-right: 10px;
          .globeImage {
            height: 22px;
          }

          .globeSmallImage {
            height: 21px;
          }
        }

        .saveIdeaBtn {
          margin-right: 5px;
        }

        button {
          i {
            color: #c0b7c5;
          }

          &:hover {
            i {
              color: #35124e;
            }
          }
        }
      }

      .shareMenu {
        display: inline-block;

        .arrowBtn {
          display: inline-block;
        }

        @media #{$small-screen} {
          padding-left: 10px;
          margin: 0px;
        }
      }
    }

    .ideaTitle {
      padding-bottom: 20px;
      font-size: 30px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.11;
      letter-spacing: normal;
      text-align: left;
      color: #18141c;

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
      padding-left: 20px;
      font-size: 12px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.83;
      letter-spacing: normal;
      text-align: left;
      color: #b5b5b5;

      .timing {
        padding-left: 40px;
      }
    }

    .ideaDescription {
      margin-top: 20px;

      .buttons {
        text-align: right;
      }

      @media #{$small-screen} {
        padding-top: 20px;
      }

      font-size: 15px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.5;
      letter-spacing: normal;
      text-align: left;
      color: #18141c;
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

    .headerLeftSideOfDesktop {
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
  }

  .noCommentDiv {
    border: 1px solid red;
  }

  @media #{$small-screen} {
    padding-right: 0%;
    padding-left: 0%;
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
    // height: 20vh;
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
  bottom: 0;
  left: 0;
  background: white;
  z-index: 100;

  height: 68px;
  padding-top: 10px;
  padding-left: 10px;
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  box-shadow: 0 -10px 10px 0 rgba(228, 228, 228, 0.73);
  background-color: #ffffff;

  @media #{$small-screen} {
    // display: none;
  }

  .newCommentInput {
    .v-input__slot {
      margin-bottom: 0px;
    }
  }

  .sendBtn {
    position: absolute;
    top: 20px;
    right: 19px;
    font-size: 21px;

    .v-icon {
      padding-bottom: 5px;
    }
  }
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

.commentDialog {
  padding: 15px 20px 20px 20px;
  background: white;
  width: 100%;

  .header {
    .cancelIcon {
      float: right;
    }
  }

  .body {
    padding: 20px 20px 20px 20px;

    .headlineText1 {
      padding-top: 20px;
      font-size: 25px;
      text-align: center;
    }

    .headlineText2 {
      padding-top: 10px;
      padding-bottom: 10px;
      text-align: center;
      font-size: 13px;
      color: rgba(192, 183, 197);
    }

    .emailInput {
      padding-top: 20px;
      margin: 0px;

      .v-icon {
        font-size: 18px;
      }
    }

    .submitBtn {
      padding-top: 20px;
      text-align: center;

      button {
        width: 100%;
      }
    }
  }
}

.emailShareDialog {
  padding: 15px 20px 20px 20px;
  background: white;

  .closeBtn {
    .cancelIcon {
      float: right;
    }
  }

  .header {
    text-align: center;
    margin-bottom: 20px;
    margin-top: 30px;

    .headlineText {
      margin-top: 10px;
      font-size: 25px;
      font-family: Quatro;
    }

    .cancelIcon {
      border: 1px solid red;
      float: right;
      padding-bottom: 10px;
    }
  }

  .shareIcon {
    color: rgba(255, 185, 45);
  }

  .btnContainer {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: right;

    .shareBtn {
      width: 170px;
    }
  }
}

.saveIdeaDialog {
  padding: 14px 25px 20px 25px;
  background: white;

  @media #{$small-screen} {
    width: 320px;
  }

  .closeBtn {
    .cancelIcon {
      float: right;
    }
  }

  .headerInfo {
    .saveIdeaDetail {
      .saveIdeaImage {
        margin-top: 40px;
      }
      .mainheader {
        font-size: 25px;
        margin-top: 35px;
        margin-left: 39px;
        letter-spacing: 1.5px;
      }

      .subHeader {
        font-size: 17px;
        letter-spacing: 1px;
        margin-top: 30px;
        margin-left: 39px;
        line-height: 25px;
        color: #777;
      }
    }
  }

  .inputDetails {
    padding-left: 12px;
    padding-right: 12px;
  }

  .btnContainer {
    margin-top: 15px;
    margin-bottom: 20px;
    // text-align: right;

    .shareBtn {
      width: 100%;
      height: 50px;
    }
  }
}

.saveIdeaEmailDialog {
  padding: 20px 20px 20px 20px;
  background: white;

  .closeBtn {
    .cancelIcon {
      float: right;
    }
  }

  .bulbImageSection {
    margin-top: 25px;
    text-align: center;
    .bulbImage {
      height: 10vh;
    }
  }

  .header {
    text-align: center;
    margin-bottom: 20px;

    .headlineText {
      letter-spacing: 1.4px;
      margin-top: 30px;
      font-size: 25px;
      font-family: Quatro;
    }

    .subHeader {
      // text-align: left;
      // margin: 25px 30px 25px 50px;
      font-size: 18px;
      margin-top: 20px;
      line-height: 35px;
      letter-spacing: normal;
      color: #777;
    }
  }

  .btnContainer {
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 30px;
    margin-right: 30px;
    // text-align: right;

    .shareBtn {
      height: 55px;
      width: 100%;
    }

    .browseBtn {
      height: 55px;
      width: 100%;
    }
  }
}

.privateIdeaSectionDialog {
  padding: 20px 20px 20px 20px;
  background: white;

  .closeBtn {
    .cancelIcon {
      float: right;
    }
  }

  .globeImageSection {
    text-align: center;
    margin-top: 45px;
    .globeImage {
      height: 6vh;
    }
  }

  .header {
    text-align: center;
    margin-bottom: 20px;
    margin-top: 30px;

    .headlineText {
      margin-top: 10px;
      font-size: 25px;
      font-family: Quatro;
      letter-spacing: 2px;
    }

    .subHeader {
      letter-spacing: 1px;
      font-size: 17px;
      margin-top: 25px;
      line-height: 32px;
      color: #777;
    }

    .rateSection {
      margin-top: 20px;
      font-size: 25px;
    }
  }

  .btnContainer {
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 30px;
    margin-right: 30px;
    // text-align: right;

    .shareBtn {
      height: 55px;
      width: 100%;
    }

    .browseBtn {
      height: 55px;
      width: 100%;
    }
  }

  @media #{$small-screen} {
    width: 320px;
    padding: 15px 15px 15px 15px;
    background: white;

    .globeImageSection {
      text-align: center;
      margin-top: 40px;
      .globeImage {
        height: 8vh;
      }
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
      margin-top: 30px;

      .headlineText {
        margin: 8px 50px 20px 50px;
        font-size: 25px;
        font-family: Quatro;
        // letter-spacing: 2px;
      }

      .subHeader {
        // letter-spacing: 1px;
        font-size: 17px;
        margin-top: 25px;
        // line-height: 32px;
        color: #777;
      }

      .rateSection {
        margin-top: 20px;
        font-size: 25px;
      }
    }
  }
}

.saveIdeaConformDivDialog {
  padding: 20px 20px 20px 20px;
  background: white;

  .closeBtn {
    .cancelIcon {
      float: right;
    }
  }

  .bulbImageSection {
    margin-top: 25px;
    text-align: center;
    .bulbImage {
      height: 10vh;
    }
  }

  .header {
    text-align: center;
    margin-bottom: 20px;

    .headlineText {
      letter-spacing: 1.4px;
      margin-top: 30px;
      font-size: 25px;
      font-family: Quatro;
    }

    .subHeader {
      // text-align: left;
      // margin: 25px 30px 25px 50px;
      font-size: 18px;
      margin-top: 20px;
      line-height: 35px;
      letter-spacing: normal;
      color: #777;
    }
  }

  .btnContainer {
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 30px;
    margin-right: 30px;
    // text-align: right;

    .shareBtn {
      height: 55px;
      width: 100%;
    }

    .browseBtn {
      height: 55px;
      width: 100%;
    }
  }
}

.saveIdeaMobileViewDialog {
  padding: 14px 25px 20px 25px;
  background: white;

  .closeBtn {
    .cancelIcon {
      float: right;
    }
  }

  .headerInfo {
    .saveIdeaDetail {
      .mainheader {
        font-size: 25px;
        margin-top: 35px;
        margin-left: 39px;
        // letter-spacing: 1.5px;
      }

      .subHeader {
        font-size: 17px;
        // letter-spacing: 1px;
        margin-top: 30px;
        margin-left: 39px;
        line-height: 25px;
        color: #777;
      }
    }
  }

  .inputDetails {
    padding-left: 12px;
    padding-right: 12px;
  }

  .btnContainer {
    margin-top: 15px;
    margin-bottom: 20px;
    // text-align: right;

    .shareBtn {
      width: 100%;
      height: 50px;
    }
  }
}
</style>
