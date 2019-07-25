<template>
  <Layout :back-button="true">
    <v-layout id="ideaDetailPage">
      <img class="backgroundLamp" src="~/assets/images/light_gray_lamp.png" />

      <!-- Headers -->
      <!-- <div class="pageHeader">
      <v-layout hidden-sm-and-down>
        <desktopHeader style="border-bottom: 1px solid #ebe7ed;"></desktopHeader>
      </v-layout>
      <v-layout class="mobileHeader" row hidden-md-and-up>
        <v-flex xs2 sm2>
          <v-icon class="icons">fas fa-arrow-left</v-icon>
        </v-flex>
        <v-flex xs8 sm8 class="text">{{user.email}}'s Idea</v-flex>
        <v-flex xs2 sm2 class="rightSide">
          <v-icon class="icons menu">fas fa-ellipsis-v</v-icon>
        </v-flex>
      </v-layout>
    </div>-->

      <v-layout row wrap>
        <!-- Left Side -->
        <v-flex xs12 sm12 md5 lg5 xl5 class="profileDetails">
          <v-layout class="sectionHeader" hidden-sm-and-down>
            <v-icon class="menu">fas fa-ellipsis-v</v-icon>
          </v-layout>

          <div class="ideaTitle">{{ idea.title }}</div>

          <div class="metadata">
            <span>{{ user.email }}</span>
            <span class="timing">{{ idea.relativeCreatedTime }}</span>
          </div>

          <!-- Description -->
          <v-layout class="ideaDescription">{{ idea.content }}</v-layout>

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
        <v-flex class="rightSideComments" xs12 sm12 md7 lg7 xl7>
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
  data: () => ({
    commentList: [
      {
        text:
          'Excepteur sint occaecat lorem cupidatat non proident, sunt in dolor sit amet consectetur',
        ups: 609,
        downs: 120
      }
    ]
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
    debugger
    this.idea.relativeCreatedTime = dayjs(this.idea.createdDate).fromNow()
  },
  methods: {}
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
    border-top: 1px solid #f5f3f6;

    @media #{$small-screen} {
      padding-right: 5%;
      padding-left: 5%;
    }

    .sectionHeader {
      display: block;
      .backBtn {
        color: $primary-color;
        font-size: 16px;
        cursor: pointer;
      }
      .menu {
        float: right;
        padding-top: 3px;
        font-size: 16px;
        cursor: pointer;
      }
    }

    .ideaTitle {
      padding-top: 20px;

      font-size: 45px;
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
