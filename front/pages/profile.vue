<template>
  <Layout v-bind="{
      loggedInHeader: true,
      mobileTitle: 'Bob\'s Profile',
      backButton: true,
           desktopSearchMode:false
    }">
    <v-layout id="profilePage">
      <img class="backgroundLamp" src="~/assets/images/light_gray_lamp.png" />

      <!-- Headers -->
      <!-- <div class="pageHeader">
        <v-layout hidden-sm-and-down>
          <desktopHeader></desktopHeader>
        </v-layout>
        <v-layout class="mobileHeader" row hidden-md-and-up>
          <v-flex xs2 sm2>
            <v-icon class="icons">fas fa-arrow-left</v-icon>
          </v-flex>
          <v-flex xs8 sm8 class="text">BOB'S PROFILE</v-flex>
          <v-flex xs2 sm2 class="rightSide">
            <v-icon class="icons">fas fa-cog</v-icon>
          </v-flex>
        </v-layout>
      </div> -->

      <v-layout row wrap>
        <!-- Left Side -->
        <v-flex xs12 sm12 md5 lg5 xl5 class="profileDetails">
          <div class="sectionHeader">
            <span class="userIcon">
              <v-icon>fas fa-user</v-icon>
            </span>
            <div class="userName">Bob Smith</div>
            <v-btn v-if="!isFollowUser" class="followAndUnFollowBtn" dark color="primary" @click="followAndUnFollow()">FOLLOW</v-btn>
            <v-btn v-else class="followAndUnFollowBtn" dark color="primary" @click="followAndUnFollow()">UNFOLLOW</v-btn>
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

          <!-- {{userData.userInfo}} -->

          <!-- <div class="tagsContainer">
            <v-chip label class="tag">web</v-chip>
            <v-chip label class="tag">illustration</v-chip>
            <v-chip label class="tag">graphics</v-chip>
            <v-chip label class="tag">ui</v-chip>
            <v-chip label class="tag">adobe</v-chip>
            <v-chip label class="tag">interface</v-chip>
          </div> -->
        </v-flex>

        <!-- Right Side -->
        <!-- {{ideaList}} -->
        <v-flex class="rightSideComments" xs12 sm12 md7 lg7 xl7>
          <div v-for="(ideas, index) in ideaList" :key="index" class="commentItem">
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
                120
              </div>
              <div class="timing">{{ ideas.relativeCreatedTime }}</div>
            </div>
          </div>

          <!-- <div v-if="i > comment" :key="i" class="noCommentItem">
            <div class="description">
              Bob hasn't added any ideas yet
            </div>
          </div>
          <div v-else></div> -->
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
    isFollowUser: false
  }),

  async asyncData({ app, route, store }) {
    const { data } = await app.$amplifyApi.graphql(
      graphqlOperation(userInfo, { userId: store.getters['cognito/userSub'] })
    )

    const userIdeasList = await app.$amplifyApi.graphql(
      graphqlOperation(userIdeas, {
        userId: store.getters['cognito/userSub']
        // nextToken: '',
        // limit: 5
      })
    )
    // console.log(userIdeasList)

    return {
      userData: data.userInfo,
      ideaList: userIdeasList.data.userIdeas.items
    }

    //
  },

  mounted() {},

  created() {
    this.ideaList.relativeCreatedTime = dayjs(
      this.ideaList.createdDate
    ).fromNow()
  },

  methods: {
    async followAndUnFollow() {
      this.isFollowUser = !this.isFollowUser

      try {
        let mutationToCall = this.isFollowUser ? followUser : unfollowUser
        await this.$amplifyApi.graphql(
          graphqlOperation(mutationToCall, {
            userId: this.$store.getters['cognito/userSub']
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

  .pageHeader {
    // border: 1px solid red;
    padding: 25px 15px;
    width: 100%;

    .mobileHeader {
      .text {
        text-align: center;
        margin-top: 2px;
        font-size: 14px;
        font-weight: 600;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.57;
        letter-spacing: 0.42px;
        text-align: center;
        color: #18141c;
      }

      i {
        color: #c0b7c5 !important;
        font-size: 15px;
      }

      .rightSide {
        text-align: right;
      }
    }
  }

  .profileDetails {
    padding: 20px;
    padding-right: 1%;
    padding-left: 3%;

    @media #{$small-screen} {
      padding-right: 5%;
      padding-left: 5%;
    }

    .sectionHeader {
      // border: 1px solid red;
      .userName {
        margin-left: 20px;
        padding-top: 5px;
        display: inline-block;

        font-size: 20px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.5;
        letter-spacing: normal;
        text-align: left;
        color: #18141c;
      }

      .userIcon {
        background: #ebe7ed;
        padding: 13px 15px;
        border-radius: 50%;

        i {
          font-size: 15px !important;
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
          font-style: normal;
          font-stretch: normal;
          line-height: 1.55;
          letter-spacing: normal;
          text-align: left;
          color: #35124e;
        }

        .text {
          font-size: 16px;
          font-weight: normal;
          font-style: normal;
          font-stretch: normal;
          line-height: 1.55;
          letter-spacing: normal;
          text-align: left;
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

      @media #{$small-screen} {
        padding-top: 20px;
      }

      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.56;
      letter-spacing: normal;
      text-align: left;
      color: #827c85;
    }

    .tagsContainer {
      margin-top: 300px;

      .tag {
        border-radius: 6px;
        background-color: #ffbd27;
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
        border-bottom: none;
        margin-top: 0px;
      }

      .commentText {
        width: 100%;
        display: block;

        @media #{$small-screen} {
          padding-top: 3px;
        }

        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.5;
        letter-spacing: normal;
        text-align: left;
        color: #18141c;
      }

      .engagement {
        display: block;
        margin-top: 10px;
        margin-bottom: 5px;
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

        .downs {
          margin-left: 20px;
          display: inline-block;
        }

        .timing {
          float: right;
          font-size: 12px;
          font-weight: normal;
          font-style: normal;
          font-stretch: normal;
          line-height: 1.83;
          letter-spacing: normal;
          text-align: right;
          color: #c0b7c5;
        }
      }
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
