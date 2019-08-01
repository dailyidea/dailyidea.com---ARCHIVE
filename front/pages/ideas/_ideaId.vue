<template>
  <Layout
    v-bind="{
      backButton: true,
      loggedInHeader: true,
      mobileTitle: user.email.toUpperCase() + '\'S IDEA'
    }"
  >
    <v-layout id="ideaDetailPage">
      <img class="backgroundLamp" src="~/assets/images/light_gray_lamp.png" />
      <v-layout row wrap>
        <!-- Left Side -->
        <v-flex xs12 sm12 md6 lg6 xl6 class="profileDetails">
          <!-- Header section -->
          <v-layout class="sectionHeader" hidden-sm-and-down>
            <!-- Share Menu -->
            <v-menu class="shareMenu" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn text icon color="light-gray" class="menu" v-on="on">
                  <v-icon>fas fa-share-alt</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-tile @click="copyShareLink()">
                  <v-list-tile-title>Copy Link</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="showEmailShareDialog = true">
                  <v-list-tile-title>Shaer Via Email</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>

            <!-- Side Settings icon -->
            <v-btn text icon color="gray" size="small" class="menu">
              <v-icon>fas fa-ellipsis-v</v-icon>
            </v-btn>
          </v-layout>

          <div class="ideaTitle">{{ idea.title }}</div>
          <div class="metadata">
            <span>{{ user.email }}</span>
            <span class="timing">{{ idea.relativeCreatedTime }}</span>
          </div>

          <!-- Description -->
          <div v-if="!ideaEditorVisible" class="ideaDescription">
            <!-- Edit Button -->
            <div class="buttons">
              <v-btn small color="primary" @click="showIdeaEditor()"
                >Edit Description</v-btn
              >
            </div>
            <v-layout v-html="idea.content"></v-layout>
          </div>
          <div v-else class="ideaEditor">
            <VueTrix
              v-model="ideaEditContents"
              class="editor"
              placeholder="Enter content"
            />
            <div class="buttons">
              <v-btn small color="primary" @click="onSaveIdeaContent()"
                >Save</v-btn
              >
              <v-btn small color="error" @click="ideaEditorVisible = false"
                >Cancel</v-btn
              >
            </div>
          </div>

          <div class="tagsContainer">
            <v-chip label class="tag">web</v-chip>
            <v-chip label class="tag">illustration</v-chip>
            <v-chip label class="tag">graphics</v-chip>
            <v-chip label class="tag">ui</v-chip>
            <v-chip label class="tag">adobe</v-chip>
            <v-chip label class="tag">interface</v-chip>
          </div>

          <!-- Engagements -->
          <div class="engagement">
            <div class="ups">
              <img class="lamp" src="~/assets/images/dark_gray_lamp.png" />
              609
            </div>
            <div class="downs">
              <img class src="~/assets/images/comments.png" />
              120
            </div>
          </div>
        </v-flex>

        <!-- Right Side -->
        <v-flex class="rightSideComments" xs12 sm12 md6 lg6 xl6>
          <div class="commentTotal">322 Comments</div>
          <div v-for="i in 60" :key="i" class="commentItem">
            <div class="header">
              <div class="commentUser">Name Surname</div>
              <div class="timing">1h</div>
            </div>
            <div class="commentText">
              Excepteur sint occaecat lorem cupidatat non proident, sunt in
              dolor sit amet consecteturdfd
            </div>
          </div>
        </v-flex>
      </v-layout>

      <!-- Foter with textbox -->
      <div class="pageFooter">
        <v-text-field
          class="newCommentInput"
          flat
          solo
          label="Say something..."
          large
        ></v-text-field>
        <v-icon class="sendBtn">fas fa-arrow-right</v-icon>
      </div>

      <!-- Popup - Share Via Email -->
      <v-dialog
        v-model="showEmailShareDialog"
        content-class="emailShareDialog"
        persistent
        max-width="400px"
      >
        <form>
          <v-card>
            <v-card-title style="text-align: center;">
              <span class="headline">Share idea using email</span>
            </v-card-title>
            <v-card-text style="padding: 0px !important;">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="emailShareForm.name"
                      v-validate="'required|max:100'"
                      label="Enter your name"
                      :error-messages="errors.collect('name')"
                      data-vv-name="name"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="emailShareForm.friendName"
                      v-validate="'required|max:100'"
                      label="Enter your friend's name"
                      :error-messages="errors.collect('friend name')"
                      data-vv-name="friend name"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      v-model="emailShareForm.friendEmail"
                      v-validate="'required|email|max:100'"
                      label="Your Friend's email address"
                      :error-messages="errors.collect('email')"
                      data-vv-name="email"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="sendShareEmail()">Share</v-btn>
              <v-btn color="red" flat @click="showEmailShareDialog = false"
                >Cancel</v-btn
              >
            </v-card-actions>
          </v-card>
        </form>
      </v-dialog>

      <!-- Bottom snackbar message -->
      <v-snackbar v-model="snackbarVisible" :timeout="6000">
        {{ snackbarMessage }}
        <v-btn color="white" flat @click="snackbarVisible = false">
          Close
        </v-btn>
      </v-snackbar>
    </v-layout>
  </Layout>
</template>
<script>
import Layout from '@/components/layout/Layout'
import { graphqlOperation } from '@aws-amplify/api'
import getIdea from '~/graphql/mutations/getIdea'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default {
  components: { Layout },
  $_veeValidate: {
    validator: 'new'
  },
  data: () => ({
    snackbarVisible: false,
    snackbarMessage: '',
    showEmailShareDialog: false,
    emailShareForm: {
      name: '',
      friendName: '',
      friendEmail: ''
    },
    ideaEditorVisible: false,
    ideaEditContents: ''
  }),
  async asyncData({ app, route, store }) {
    const { data } = await app.$amplifyApi.graphql(
      graphqlOperation(getIdea, { ideaId: route.params.ideaId })
    )

    return {
      idea: data.getIdea,
      user: { email: store.state.cognito.user.attributes.email }
    }
  },
  created() {
    this.idea.relativeCreatedTime = dayjs(this.idea.createdDate).fromNow()
  },
  methods: {
    copyShareLink() {
      this.$clipboard(window.location.href)
      this.snackbarMessage = 'Link copied'
      this.snackbarVisible = true
    },
    async sendShareEmail() {
      //Validate input fields
      let result = await this.$validator.validateAll()
      if (!result) {
        return
      }

      //TODO: Send email from backend
      this.snackbarMessage = 'Email sent successfully.'
      this.showEmailShareDialog = false
      this.snackbarVisible = true
    },
    showIdeaEditor() {
      debugger
      this.ideaEditContents = this.idea.content
      this.ideaEditorVisible = true
    },
    onSaveIdeaContent() {
      this.idea.content = this.ideaEditContents
      this.ideaEditorVisible = false
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
  overflow-x: hidden;
  overflow: auto;
  position: relative;

  @media #{$desktop} {
    height: 90vh;
    overflow-y: hidden;
  }

  .profileDetails {
    padding: 20px;
    // padding-top: 5px;
    background: white;
    overflow: auto;
    // border-top: 1px solid #f5f3f6;

    @media #{$small-screen} {
      padding-right: 5%;
      padding-left: 5%;
    }

    .sectionHeader {
      display: block;
      text-align: right;

      .shareMenu {
        display: inline-block;
      }

      .menu {
        margin: 0px;

        // border: 1px solid red;
        i {
          font-size: 13px !important;
        }
      }
    }

    .ideaTitle {
      padding-top: 30px;

      font-size: 40px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.11;
      letter-spacing: normal;
      text-align: left;
      color: #18141c;
    }

    .metadata {
      padding-top: 20px;
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
        padding-left: 30%;
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

      .buttons {
        margin-top: 10px;

        button {
          margin-left: 0px;
        }
      }

      .editor {
        .trix-content {
          height: 170px !important;
          max-height: 200px !important;
          overflow-y: auto;
        }
      }
    }

    .tagsContainer {
      margin-top: 20px;

      .tag {
        border-radius: 6px;
        background-color: #ffbd27;
      }
    }

    .engagement {
      display: block;
      margin-top: 30px;
      margin-bottom: 5px;
      padding-left: 5px;

      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      letter-spacing: normal;
      text-align: left;
      color: #c0b7c5;

      img {
        height: 14px;
        margin-right: 5px;
      }

      .ups {
        display: inline-block;
        height: 18px;
      }

      img,
      .lamp {
        margin-right: 2px;
      }

      .downs {
        margin-left: 20px;
        display: inline-block;
      }
    }
  }

  .rightSideComments {
    padding-right: 10px;
    padding-left: 10px;
    padding-bottom: 50px;

    @media #{$desktop} {
      height: 90vh;
      overflow: auto;
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
    }
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

    .newCommentInput {
      .v-input__slot {
        margin-bottom: 0px;
      }

      .v-text-field__details {
        display: none;
      }
    }

    .sendBtn {
      position: absolute;
      top: 24px;
      right: 19px;
      font-size: 21px;
      color: #d4bb10;
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
}
</style>
