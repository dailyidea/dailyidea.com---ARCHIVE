<template>
  <v-layout id="profilePage">
    <HeaderComponent></HeaderComponent>
    <v-layout row wrap>
      <!-- Left Side -->
      <v-flex xs12 sm12 md5 lg5 xl5 class="profileDetails">
        <div class="header">
          <span class="userIcon">
            <v-icon>fas fa-user</v-icon>
          </span>
          <div class="userName">Bob Smith</div>
          <v-btn class="followBtn" color="primary">FOLLOW</v-btn>
        </div>

        <!-- Mobile - Profile Description -->
        <v-layout class="profileDescription" hidden-md-and-up>
          Hi! My name is Bob, I’m a creative geek from San Francisco, CA. I
          enjoy creating eye candy solutions for web and mobile apps. Contact me
          at bob@mail.com
        </v-layout>

        <!-- 3 Boxes -->
        <v-layout class="boxContainer" row>
          <v-flex xs4 sm4 md4 lg4 xl4>
            <div class="box first">
              <div class="number">140</div>
              <div class="text">Ideas</div>
            </div>
          </v-flex>
          <v-flex xs4 sm4 md4 lg4 xl4>
            <div class="box">
              <div class="number">24k</div>
              <div class="text">Followers</div>
            </div>
          </v-flex>
          <v-flex xs4 sm4 md4 lg4 xl4>
            <div class="box last">
              <div class="number">1,980</div>
              <div class="text">Following</div>
            </div>
          </v-flex>
        </v-layout>

        <!-- Desktop - Profile Description -->
        <v-layout class="profileDescription" hidden-sm-and-down>
          Hi! My name is Bob, I’m a creative geek from San Francisco, CA. I
          enjoy creating eye candy solutions for web and mobile apps. Contact me
          at bob@mail.com
        </v-layout>

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
        <div class="commentItem" v-for="i in 6" :key="i">
          <div class="commentText">
            Excepteur sint occaecat lorem cupidatat non proident, sunt in dolor
            sit amet consectetur
          </div>
          <div class="engagement">
            <div class="ups">
              <img class="logoIcon" src="~/assets/images/logo_icon.png" />
              609
            </div>
            <div class="downs">
              <img
                class="logoIcon"
                src="~/assets/images/profile/comments.png"
              />
              120
            </div>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-layout>
</template>
<script>
import HeaderComponent from './../components/loggedInHeader.vue'
export default {
  components: { HeaderComponent },
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
  methods: {}
}
</script>
<style lang="scss">
@import './assets/style/variables.scss';
// Remove top header manually
#app {
  .toolBar {
    display: none;
  }
  .nuxtContainer {
    padding-top: 0px !important;
  }
}
#profilePage {
  padding-top: 130px;
  background: white;
  min-height: 100vh;
  padding-bottom: 2vh;

  .profileDetails {
    padding: 20px;
    padding-right: 1%;
    padding-left: 3%;

    @media #{$small-screen} {
      padding-right: 5%;
      padding-left: 5%;
    }
    .header {
      // border: 1px solid red;
      .userName {
        margin-left: 20px;
        padding-top: 4px;
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
        padding: 10px 13px;
        border-radius: 50%;
        i {
          font-size: 15px !important;
          line-height: 16px !important;
          color: #35124e !important;
        }
      }

      .followBtn {
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

      font-size: 16px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.56;
      letter-spacing: normal;
      text-align: left;
      color: #827c85;
    }

    .tagsContainer {
      margin-top: 20px;

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
      padding-right: 5%;
      padding-left: 5%;
    }

    .commentItem {
      border: solid 1px rgba(228, 228, 228, 0.38);
      margin-top: 15px;
      padding: 10px;

      .commentText {
        width: 100%;
        display: block;

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
      }
    }
  }
}
</style>
