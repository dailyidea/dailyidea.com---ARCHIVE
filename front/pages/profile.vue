<template>
  <Layout
    v-bind="{
      currentPage: 'Profile',
      pageOptions: mobileHeaderUiOptions
    }"
  >
    <v-layout id="profilePage">
      <visual-notifier ref="notifier"></visual-notifier>
      <img class="backgroundLamp" src="~/assets/images/light_gray_lamp.png" />

      <v-layout row wrap>
        <!-- Left Side -->
        <v-flex xs12 sm12 md5 lg5 xl5 class="profileDetails">
          <div class="sectionHeader">
            <v-btn small to="/profile" class="userIcon" fab>
              <v-icon>fas fa-user</v-icon>
            </v-btn>
            <div class="userName" style="vertical-align: top">
              <span v-if="!editProfileInfoMode">
                <v-btn rounded outlined @click="enableEditProfileInfo"
                  >{{ userData.name }} <v-icon right>mdi-pencil</v-icon></v-btn
                >
              </span>
              <v-row v-else>
                <v-form v-model="nameIsValid">
                  <v-text-field
                    v-model="nameForEdit"
                    :disabled="savingChanges"
                    maxlength="128"
                    :rules="nameRules"
                    class="username-edit"
                    dense
                    autofocus
                    placeholder="Yor Name"
                  ></v-text-field>
                </v-form>
              </v-row>
            </div>
            <span v-if="!isMe">
              <v-btn
                v-if="!isFollowUser"
                class="followAndUnFollowBtn"
                dark
                color="primary"
                @click="followAndUnFollow()"
                >FOLLOW</v-btn
              >
              <v-btn
                v-else
                class="followAndUnFollowBtn"
                dark
                color="primary"
                @click="followAndUnFollow()"
                >UNFOLLOW</v-btn
              >
            </span>
          </div>

          <!-- Mobile - Profile Description -->
          <v-layout class="profileDescription" hidden-md-and-up>
            <span v-if="!editProfileInfoMode">{{ userData.bio }}</span>
            <v-textarea
              v-else
              v-model="bioForEdit"
              :rows="3"
              maxlength="1000"
              placeholder="Tell few words about yourself"
              :disabled="savingChanges"
            ></v-textarea>
          </v-layout>
          <v-row v-if="editProfileInfoMode" class="hidden-md-and-up">
            <v-col class="text-right">
              <v-btn outlined @click="cancelEditProfileInfo">Cancel</v-btn>
              <v-btn
                :disabled="!allowSave"
                :loading="savingChanges"
                @click="saveProfileChanges"
                >Save</v-btn
              >
            </v-col>
          </v-row>

          <!-- 3 Boxes -->
          <v-layout class="boxContainer" row>
            <v-flex xs4 sm4 md4 lg4 xl4>
              <div class="box first">
                <div class="number">{{ userData.ideasCreated }}</div>
                <div class="text">Ideas</div>
              </div>
            </v-flex>
            <v-flex xs4 sm4 md4 lg4 xl4>
              <div class="box">
                <div class="number">{{ userData.followersCount }}</div>
                <div class="text">Followers</div>
              </div>
            </v-flex>
            <v-flex xs4 sm4 md4 lg4 xl4>
              <div class="box last">
                <div class="number">{{ userData.followeesCount }}</div>
                <div class="text">Following</div>
              </div>
            </v-flex>
          </v-layout>

          <!-- Desktop - Profile Description -->
          <v-row class="profileDescription hidden-sm-and-down">
            <v-col>
              <v-row>
                <v-col>
                  <span v-if="!editProfileInfoMode">{{ userData.bio }}</span>
                  <v-textarea
                    v-else
                    v-model="bioForEdit"
                    :rows="3"
                    maxlength="1000"
                    :disabled="savingChanges"
                    placeholder="Tell few words about yourself"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row v-if="editProfileInfoMode">
                <v-col class="text-right">
                  <v-btn outlined @click="cancelEditProfileInfo">Cancel</v-btn>
                  <v-btn
                    :disabled="!allowSave"
                    :loading="savingChanges"
                    @click="saveProfileChanges"
                    >Save</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <!-- Tags -->
          <div class="tagsContainer">
            <v-chip label class="tag">web</v-chip>
            <v-chip label class="tag">illustration</v-chip>
            <v-chip label class="tag">graphics</v-chip>
            <v-chip label class="tag">ui</v-chip>
            <v-chip label class="tag">adobe</v-chip>
            <v-chip label class="tag">interface</v-chip>
          </div>
        </v-flex>

        <!-- Right Side -->
        <v-flex class="rightSideComments" xs12 sm12 md7 lg7 xl7>
          <!-- Idea List -->
          <div
            v-for="(ideas, index) in ideaList"
            :key="index"
            class="commentItem"
          >
            <div class="cmtText">
              {{ ideas.title }}
            </div>
            <div class="engagement">
              <div class="ups">
                <img class="logoIcon" src="~/assets/images/logo_icon.png" />
                {{ ideas.likesCount }}
              </div>
              <div class="downs">
                <img class="logoIcon" src="~/assets/images/comments.png" />
                --
              </div>
              <div class="timing">{{ ideas.createdDate | toRelativeDate }}</div>
            </div>
          </div>

          <div v-if="nextToken" class="loadMoreBtn">
            <v-btn :loading="loadingIdea" @click="loadMoreIdea()">
              Load More
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-layout>
  </Layout>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import Layout from '@/components/layout/Layout'
import followUser from '~/graphql/mutations/followUser'
import unfollowUser from '~/graphql/mutations/unfollowUser'
import userInfo from '~/graphql/query/userInfo'
import userIdeas from '~/graphql/query/userIdeas'
import updateProfileInfo from '@/graphql/mutations/updateProfileInfo'
import VisualNotifier from '~/components/VisualNotifier'

export default {
  components: { Layout, VisualNotifier },

  async asyncData({ app, route, store }) {
    const profileUserId = store.getters['cognito/userSub']

    const pageSize = 25

    const { data } = await app.$amplifyApi.graphql(
      graphqlOperation(userInfo, { userId: profileUserId })
    )

    const userIdeasList = (
      await app.$amplifyApi.graphql(
        graphqlOperation(userIdeas, {
          userId: profileUserId,
          nextToken: null,
          limit: pageSize
        })
      )
    ).data.userIdeas

    return {
      nextToken: userIdeasList.nextToken,
      userData: data.userInfo.userInfo,
      ideaList: userIdeasList.items,
      profileUserId,
      pageSize
    }
  },
  data: () => ({
    mobileHeaderUiOptions: {
      pageTitle: "Bob's Profile",
      leftButtonType: 'back'
    },
    isFollowUser: false,
    loadingIdea: false,

    profileUserId: '',

    editProfileInfoMode: false,

    bioForEdit: undefined,
    nameForEdit: undefined,
    nameIsValid: undefined,
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length > 3) || 'Name must be more than 3 characters'
    ],
    savingChanges: false
  }),
  computed: {
    isMe() {
      return (
        this.$store.getters['cognito/userSub'] &&
        this.$store.getters['cognito/userSub'] === this.userData.userId
      )
    },
    allowSave() {
      return (
        this.editProfileInfoMode &&
        this.nameIsValid &&
        (this.userData.name !== this.nameForEdit ||
          (this.userData.bio || '') !== (this.bioForEdit || ''))
      )
    }
  },

  mounted() {},

  created() {},

  methods: {
    async loadMoreIdea() {
      this.loadingIdea = true

      const response = (
        await this.$amplifyApi.graphql(
          graphqlOperation(userIdeas, {
            userId: this.profileUserId,
            nextToken: this.nextToken,
            limit: this.pageSize
          })
        )
      ).data.userIdeas

      // Set next token for next batch of ideas
      this.nextToken = response.nextToken

      // Push ideas
      this.ideaList = this.ideaList.concat(response.items)
      this.loadingIdea = false
    },

    async followAndUnFollow() {
      this.isFollowUser = !this.isFollowUser

      try {
        const mutationToCall = this.isFollowUser ? followUser : unfollowUser
        await this.$amplifyApi.graphql(
          graphqlOperation(mutationToCall, {
            userId: this.profileUserId
          })
        )
        if (this.isFollowUser) {
          this.userData.followersCount++
        } else {
          this.userData.followersCount--
        }
      } catch (err) {
        console.error(err)
        this.snackbarMessage = 'Something went wrong!!'
        this.snackbarColor = 'error'
        this.snackbarVisible = true
      }
    },
    enableEditProfileInfo() {
      this.nameForEdit = this.userData.name
      this.bioForEdit = this.userData.bio
      this.editProfileInfoMode = true
    },
    cancelEditProfileInfo() {
      this.editProfileInfoMode = false
    },
    async saveProfileChanges() {
      try {
        this.savingChanges = true
        const resp = await this.$amplifyApi.graphql(
          graphqlOperation(updateProfileInfo, {
            bio: this.bioForEdit,
            name: this.nameForEdit
          })
        )

        if (resp.data.updateProfileInfo.result.ok) {
          this.userData.bio = resp.data.updateProfileInfo.updatedInfo.bio
          this.userData.name = resp.data.updateProfileInfo.updatedInfo.name
          this.userData.slug = resp.data.updateProfileInfo.updatedInfo.slug
          this.editProfileInfoMode = false
          this.$refs.notifier.success('Profile Updated')
        } else {
          this.$refs.notifier.error(
            resp.data.updateProfileInfo.result.error || 'Something went wrong!!'
          )
        }
      } catch (err) {
        console.log(err)
        // this.$refs.notifier.error('Something went wrong!!')
      }
      this.savingChanges = false
    }
  }
}
</script>

<style lang="scss">
#profilePage {
  padding-top: 13px;
  background: white;
  min-height: 100vh;
  padding-bottom: 2vh;
  display: block;
  width: 100%;
  overflow-x: hidden;

  @media #{$small-screen} {
    padding-top: 0vh;
  }

  .profileDetails {
    padding: 20px;
    padding-right: 1%;
    padding-left: 3%;

    @media #{$small-screen} {
      padding-right: 8%;
      padding-left: 8%;
    }

    .sectionHeader {
      min-height: 50px;
      .userName {
        margin-left: 20px;
        /*padding-top: 5px;*/
        display: inline-block;

        font-size: 20px;
        color: #18141c;
      }

      .userIcon {
        background: #ebe7ed !important;
        padding: 10px 15px;
        border-radius: 50%;

        i {
          font-size: 14px !important;
          line-height: 16px !important;
          color: #35124e !important;
        }
      }

      .followAndUnFollowBtn {
        float: right;
        margin: 0px;
      }
    }

    .boxContainer {
      width: 100%;
      margin: auto;
      margin-top: 25px;

      .box {
        border-radius: 4px;
        border: solid 1px rgba(187, 187, 187, 0.38);
        padding: 10px;
        margin: 10px;

        @media #{$small-screen} {
          margin: 10px 5px;
        }

        .number {
          color: $primary-color;
          font-weight: bold;

          font-size: 16px;
          font-weight: bold;
          color: #35124e;
        }

        .text {
          font-size: 16px;
          color: #c0b7c5;
        }
      }

      .first {
        margin-left: 0px !important;
      }

      .last {
        margin-right: 0px !important;
      }
    }

    .profileDescription {
      margin-top: 20px;
      min-height: 45vh;

      @media #{$small-screen} {
        min-height: 0vh;
      }

      font-size: 14px;
      color: #827c85;
    }

    .tagsContainer {
      border-top: 1px solid #ece8ee;
      padding-top: 20px;

      @media #{$small-screen} {
        border-top: none;
      }

      .tag {
        border-radius: 6px;
        background-color: #c0b7c5;
        margin: 5px 5px;
        color: white;
      }
    }
  }

  .rightSideComments {
    padding-right: 3%;
    padding-left: 2%;

    @media #{$small-screen} {
      padding-right: 0%;
      padding-left: 0%;
    }

    .commentItem {
      border: solid 1px rgba(228, 228, 228, 0.38);
      margin-top: 15px;
      padding: 10px;

      @media #{$small-screen} {
        border-left: 0px;
        border-right: 0px;
        border-bottom: 0px;
        margin-left: 15px;
        margin-right: 15px;
        padding-bottom: 0px;
      }

      .commentText {
        width: 100%;
        display: block;

        @media #{$small-screen} {
          padding-top: 3px;
        }

        font-size: 16px;
        color: #18141c;
      }

      .engagement {
        display: block;
        margin-top: 10px;
        margin-bottom: 5px;
        font-size: 14px;
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

        .downs {
          margin-left: 20px;
          display: inline-block;
        }

        .timing {
          float: right;
          font-size: 12px;
          text-align: right;
          color: #c0b7c5;
        }
      }
    }

    .loadMoreBtn {
      width: 100%;
      text-align: center;
      padding-top: 30px;
    }
  }

  .backgroundLamp {
    position: absolute;
    width: 350px;
    margin-top: 40vh;
    left: 17%;

    @media #{$small-screen} {
      top: 100px;
      margin-top: 0vh;
      left: -48%;
      width: 100%;
      height: 60vh;
    }
  }

  .username-edit {
    padding-top: 0;
    margin-top: 0;
    .v-input__slot {
      margin-bottom: 0;
    }
  }
}
</style>
