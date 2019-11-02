<template>
  <Layout
    v-bind="{
      currentPage: 'Profile',
      pageOptions: mobileHeaderUiOptions
    }"
  >
    <v-layout id="profilePage">
      <img class="backgroundLamp" src="~/assets/images/light_gray_lamp.png" />

      <v-layout row wrap>
        <!-- Left Side -->
        <v-flex xs12 sm12 md5 lg5 xl5 class="profileDetails">
          <div class="sectionHeader">
            <v-btn small to="/profile" class="userIcon" fab disabled>
              <v-icon>fas fa-user</v-icon>
            </v-btn>
            <div class="userName">Bob Smith</div>
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
          </div>

          <!-- Mobile - Profile Description -->
          <v-layout class="profileDescription" hidden-md-and-up>
            Hi! My name is Bob, I’m a creative geek from San Francisco, CA. I
            enjoy creating eye candy solutions for web and mobile apps. Contact
            me at bob@mail.com
          </v-layout>

          <!-- 3 Boxes -->
          <v-layout class="boxContainer" row>
            <v-flex xs4 sm4 md4 lg4 xl4>
              <div class="box first">
                <div class="number">{{ userData.userInfo.ideasCreated }}</div>
                <div class="text">Ideas</div>
              </div>
            </v-flex>
            <v-flex xs4 sm4 md4 lg4 xl4>
              <div class="box">
                <div class="number">{{ userData.userInfo.followersCount }}</div>
                <div class="text">Followers</div>
              </div>
            </v-flex>
            <v-flex xs4 sm4 md4 lg4 xl4>
              <div class="box last">
                <div class="number">{{ userData.userInfo.followeesCount }}</div>
                <div class="text">Following</div>
              </div>
            </v-flex>
          </v-layout>

          <!-- Desktop - Profile Description -->
          <v-layout class="profileDescription" hidden-sm-and-down>
            Hi! My name is Bob, I’m a creative geek from San Francisco, CA. I
            enjoy creating eye candy solutions for web and mobile apps. Contact
            me at bob@mail.com
          </v-layout>

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
              <div class="timing">{{ ideas.relativeCreatedTime }}</div>
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
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Layout from '@/components/layout/Layout'
import followUser from '~/graphql/mutations/followUser'
import unfollowUser from '~/graphql/mutations/unfollowUser'
import userInfo from '~/graphql/query/userInfo'
import userIdeas from '~/graphql/query/userIdeas'
dayjs.extend(relativeTime)

export default {
  components: { Layout },
  data: () => ({
    mobileHeaderUiOptions: {
      pageTitle: "Bob's Profile",
      leftButtonType: 'back'
    },
    isFollowUser: false,
    loadingIdea: false,

    profileUserId: ''
  }),

  async asyncData({ app, route, store }) {
    let profileUserId = store.getters['cognito/userSub']

    let pageSize = 10

    const { data } = await app.$amplifyApi.graphql(
      graphqlOperation(userInfo, { userId: profileUserId })
    )
    console.log('profile data', data)

    let userIdeasList = (await app.$amplifyApi.graphql(
      graphqlOperation(userIdeas, {
        userId: profileUserId,
        nextToken: null,
        limit: pageSize
      })
    )).data.userIdeas

    return {
      nextToken: userIdeasList.nextToken,
      userData: data.userInfo,
      ideaList: userIdeasList.items,
      profileUserId: profileUserId,
      pageSize: pageSize
    }
  },

  mounted() {},

  created() {
    this.ideaList.forEach(idea => {
      idea.relativeCreatedTime = dayjs(idea.createdDate).fromNow()
    })
  },

  methods: {
    async loadMoreIdea() {
      this.loadingIdea = true

      let response = (await this.$amplifyApi.graphql(
        graphqlOperation(userIdeas, {
          userId: this.profileUserId,
          nextToken: this.nextToken,
          limit: this.pageSize
        })
      )).data.userIdeas

      // Set next token for next batch of ideas
      this.nextToken = response.nextToken

      // Push ideas
      this.ideaList = this.ideaList.concat(response.items)
      this.loadingIdea = false
    },

    async followAndUnFollow() {
      this.isFollowUser = !this.isFollowUser

      try {
        let mutationToCall = this.isFollowUser ? followUser : unfollowUser
        await this.$amplifyApi.graphql(
          graphqlOperation(mutationToCall, {
            userId: this.profileUserId
          })
        )
        if (this.isFollowUser) {
          this.userData.userInfo.followersCount++
        } else {
          this.userData.userInfo.followersCount--
        }
      } catch (err) {
        console.error(err)
        this.snackbarMessage = 'Something went wrong!!'
        this.snackbarColor = 'error'
        this.snackbarVisible = true
      }
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
      .userName {
        margin-left: 20px;
        padding-top: 5px;
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
}
</style>
