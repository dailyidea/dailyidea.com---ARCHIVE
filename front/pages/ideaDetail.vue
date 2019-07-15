<template>
  <v-layout id="ideaDetailPage">

    <!-- <img class="backgroundLamp" src="~/assets/images/profile/background_lamp.png" /> -->

    <!-- Headers -->
    <div class="pageHeader">
      <v-layout hidden-sm-and-down>
        <desktopHeader style="border-bottom: 1px solid #ebe7ed;"></desktopHeader>
      </v-layout>
      <v-layout class="mobileHeader" row hidden-md-and-up>
        <v-flex xs2 sm2>
          <v-icon class="icons">fas fa-arrow-left</v-icon>
        </v-flex>
        <v-flex xs8 sm8 class="text">
          BOB'S PROFILE
        </v-flex>
        <v-flex xs2 sm2 class="rightSide">
          <v-icon class="icons">fas fa-cog</v-icon>
        </v-flex>
      </v-layout>
    </div>

    <v-layout row wrap>
      <!-- Left Side -->
      <v-flex xs12 sm12 md5 lg5 xl5 class="profileDetails">
        <div class="sectionHeader">
          <v-icon>fas fa-ellipsis-v</v-icon>
        </div>

        <div class="ideaTitle">
          Title lorem ipsum dolor sit amet conset
          adipiscing elit
        </div>

        <div class="metadata">
          <span>Bob Smith</span>
          <span class="timing">1h ago</span>
        </div>

        <!-- Description -->
        <v-layout class="ideaDescription">
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.Excepteur sint occaecat cupidatat non proident, sunt in culpa qui.
          <br /><br />
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim. Excepteur sint occaecat cupidatat non provident.
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
        <div class="commentItem" v-for="i in 60" :key="i">
          <div class="commentText">
            Excepteur sint occaecat lorem cupidatat non proident, sunt in dolor
            sit amet consecteturdfd
          </div>
          <div class="engagement">
            <div class="ups">
              <img class="logoIcon" src="~/assets/images/logo_icon.png" />
              609
            </div>
            <div class="downs">
              <img class="logoIcon" src="~/assets/images/comments.png" />
              120
            </div>
            <div class="timing">
              1h ago
            </div>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-layout>
</template>
<script>
import desktopHeader from './../components/loggedInDesktopHeader.vue'
export default {
  components: { desktopHeader },
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

#ideaDetailPage {
  padding-top: 65px;
  background: #ebe7ed;
  padding-bottom: 2vh;
  display: block;
  width: 100%;
  overflow-x: hidden;
  height: 100vh;
  overflow-y: hidden;

  @media #{$small-screen} {
    padding-top: 0vh;
  }

  .pageHeader {
    // border: 1px solid red;
    width: 100%;

    .mobileHeader {
      padding: 25px 15px;
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
    padding: 25px;
    background: white;
    overflow: auto;

    @media #{$small-screen} {
      padding-right: 5%;
      padding-left: 5%;
    }

    .sectionHeader {
      text-align: right;
      i {
        font-size: 13px;
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
  }

  .rightSideComments {
    padding-right: 3%;
    padding-left: 2%;

    height: 90vh;
    overflow: auto;

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
