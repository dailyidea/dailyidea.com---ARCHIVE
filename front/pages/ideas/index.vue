<template>
  <v-layout id="ideaListPage">
    <!-- Headers -->
    <!-- <div class="pageHeader">
      <v-layout hidden-sm-and-down>
        <desktopHeader></desktopHeader>
      </v-layout>
      <v-layout class="mobileHeader" row hidden-md-and-up>
        <v-flex xs2 sm2>
          <v-icon class="icons">fas fa-bars</v-icon>
        </v-flex>
        <v-flex xs8 sm8 class="text">MY IDEAS</v-flex>
        <v-flex xs2 sm2 class="rightSide">
          <v-icon class="icons">fas fa-search</v-icon>
        </v-flex>
      </v-layout>
    </div>-->

    <!-- Title Section -->
    <div class="titleDiv">
      <v-layout class="titleText" hidden-sm-and-down>MY IDEAS</v-layout>
      <div class="sortBy">
        <v-icon>fas fa-clock</v-icon>Sort by Newest
      </div>
    </div>

    <!-- Idea List -->
    <v-layout class="ideaList" row wrap>
      <v-flex class="ideaContainer" xs12 sm12 md4 lg4 xl4 v-for="idea in ideas" :key="idea">
        <div class="ideaItem" @click="$router.push({path:'/ideas/' + idea.ideaId, force: true})">
          <div class="ideaDescription">{{idea.title}}</div>
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
              <!-- {{idea.createdDate}} -->
            </div>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-layout>
</template>
<script>
import desktopHeader from './../../components/loggedInDesktopHeader'

import { graphqlOperation } from '@aws-amplify/api'
import getIdeas from '~/graphql/mutations/getIdeas'
import moment from 'moment'
export default {
  components: { desktopHeader },
  async asyncData({ app }) {
    const {
      data: { ideas }
    } = await app.$amplifyApi.graphql(graphqlOperation(getIdeas))
    debugger
    return {
      ideas: ideas.items
    }
  }
}
</script>

<style lang="scss">
#ideaListPage {
  padding-top: 50px;
  background: white;
  min-height: 100vh;
  padding-bottom: 2vh;
  display: block;
  width: 100%;
  overflow-x: hidden;

  padding-right: 3%;
  padding-left: 2%;

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

  .titleDiv {
    text-align: center;
    // border: 1px solid red;
    min-height: 30px;
    .titleText {
      display: inline-block;
      margin-bottom: 20px;

      font-size: 17px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.59;
      letter-spacing: 0.51px;
      text-align: center;
      color: #232323;
    }
    .sortBy {
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.57;
      letter-spacing: normal;
      text-align: left;
      color: #35124e;

      float: right;
      text-align: right;

      @media #{$small-screen} {
        float: left;
        text-align: left;
        padding-left: 5%;
        font-size: 12px;
      }

      i {
        font-size: 17px;
        padding-right: 7px;
        color: #35124e;
      }
    }
  }

  .ideaList {
    margin-left: -10px;
    margin-right: -10px;

    @media #{$small-screen} {
      padding-right: 0%;
      padding-left: 0%;
    }

    .ideaContainer {
      padding: 10px 10px;
      @media #{$small-screen} {
        padding: 0px !important;

        &:last-child {
          border-bottom: solid 1px rgba(228, 228, 228, 0.38);
        }
      }

      .ideaItem {
        border: solid 1px rgba(228, 228, 228, 0.38);
        padding: 10px;
        cursor: pointer;

        @media #{$small-screen} {
          border-left: 0px;
          border-right: 0px;
          border-bottom: none;
          margin-top: 0px;
        }

        .ideaDescription {
          width: 100%;
          display: block;
          overflow-wrap: break-word;
          min-height: 50px;
          @media #{$small-screen} {
            padding-top: 3px;
            min-height: 10px;
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
            padding-right: 20px;
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
  }
}
</style>
