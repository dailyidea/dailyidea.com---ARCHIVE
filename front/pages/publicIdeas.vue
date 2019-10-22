<template>
  <Layout v-bind="{
      loggedInHeader: true,
      mobileTitle: 'Public Ideas',
      mobileHamburger: true,
      mobileSearchIcon: true,
      mobileSettingsIcon: true,

      desktopMenuVisible: true
    }">
    <v-layout id="ideaListPage">
      <!-- Title Section -->
      <div v-if="ideas && ideas.length > 0" class="titleDiv">
        <v-layout class="titleText" hidden-sm-and-down>PUBLIC IDEAS</v-layout>
      </div>

      <!-- Idea List -->
      <!-- {{ideas}} -->

      <div v-if="ideas && ideas.length > 0" class="publisIdeasSection">
        <div class="sortBy">
          <v-icon>fas fa-clock</v-icon>Sort by Newest
        </div>
        <div class="ideaList" wrap>
          <v-flex v-for="(idea, index) in ideas" :key="index" class="ideaContainer">
            <div class="ideaItem" @click="
                $router.push({
                  name: 'ideas-userId-ideaId',
                  params: {
                    ideaId: idea.ideaId,
                    userId: $store.getters['cognito/userSub']
                  },
                  force: true
                })
              ">
              <!-- {{idea.ideaId }} -->
              <div class="ideaTitle">{{ idea.title }}</div>
              <div class=" ideaDescrpition">
                <v-layout v-html="idea.content"> </v-layout>
              </div>
              <div class="engagement">
                <div class="ups">
                  <img class="logoIcon" src="~/assets/images/logo_icon.png" />
                  {{ idea.likesCount }}
                </div>
                <div class="downs">
                  <img class="logoIcon" src="~/assets/images/comments.png" />
                  120
                </div>
                <div class="timing">{{ idea.relativeCreatedTime }}</div>
              </div>
            </div>
          </v-flex>
        </div>
      </div>

      <!-- No Idea found div -->
      <div v-else class="noIdeaFoundDiv">
        <div>
          <img class="lampImg" src="~/assets/images/light_gray_lamp_plain.png" />
        </div>
        <div class="text">
          You don't have any ideas right now. <br />
          Or do you?
        </div>
        <img class="arrowImg" src="~/assets/images/arrowImage.png" />
      </div>

      <!-- LodaMore Button -->

      <div class="loadMoreBtn">
        <v-btn v-if="nextToken" :loading="loadingIdea" @click="loadMoreIdea()">
          Load More Idea
        </v-btn>
      </div>

      <!-- Add Idea Button -->
      <v-btn class="addBtn" fab to="/ideas/create">
        <v-icon>add</v-icon>
      </v-btn>

      <!-- Bottom snackbar message -->
      <v-snackbar v-model="snackbarVisible" :timeout="2000" :color="snackbarColor">
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
import getIdeas from '~/graphql/query/getIdeas'
import Layout from '@/components/layout/Layout'
dayjs.extend(relativeTime)

export default {
  components: { Layout },

  data: () => ({
    snackbarVisible: false,
    snackbarMessage: '',
    snackbarColor: 'success',
    loadingIdea: false
  }),

  async asyncData({ app }) {
    const {
      data: { ideas }
    } = await app.$amplifyApi.graphql(
      graphqlOperation(getIdeas, { nextToken: null, limit: 5 })
    )

    return {
      // Set next token for next batch of ideas
      nextToken: ideas.nextToken,
      // Set ideas
      ideas: ideas.items
    }
  },
  created() {
    // this.idea.relativeCreatedTime = dayjs(this.idea.createdDate).fromNow()
    this.ideas.forEach(idea => {
      idea.relativeCreatedTime = dayjs(idea.createdDate).fromNow()
    })
  },

  methods: {
    async loadMoreIdea() {
      this.loadingIdea = true
      if (!this.nextToken) {
        return
      }
      const {
        data: { ideas }
      } = await this.$amplifyApi.graphql(
        graphqlOperation(getIdeas, { nextToken: this.nextToken, limit: 10 })
      )

      // Set next token for next batch of ideas
      this.nextToken = ideas.nextToken
      // Push ideas
      this.ideas = this.ideas.concat(ideas.items)
      this.loadingIdea = false
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

  .addBtn {
    position: fixed;
    right: 40px;
    bottom: 30px;
  }

  .loadMoreBtn {
    padding-top: 20px;
    text-align: center;
  }

  @media #{$small-screen} {
    padding-top: 0vh;
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
  }

  .publisIdeasSection {
    .sortBy {
      margin-left: 26%;
      margin-bottom: 15px;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.57;
      letter-spacing: normal;
      text-align: left;
      color: #35124e;

      // float: right;
      // text-align: right;

      @media #{$small-screen} {
        // float: left;
        // text-align: left;
        // padding-left: 5%;
        font-size: 12px;
        padding-top: 10px;
        margin-left: 15px;
      }

      i {
        font-size: 17px;
        padding-right: 7px;
        color: #35124e;
      }
    }
    .ideaList {
      text-align: center;

      margin-left: 25%;
      margin-right: 25%;

      @media #{$small-screen} {
        padding-right: 0%;
        padding-left: 0%;
        margin: 0px;
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
          padding: 15px 20px;
          cursor: pointer !important;

          &:hover {
            -webkit-box-shadow: 0px 0px 5px 3px #e3e3e361;
            -moz-box-shadow: 0px 0px 5px 3px #e3e3e361;
            box-shadow: 0px 0px 5px 3px #e3e3e361;
          }

          @media #{$small-screen} {
            border-left: 0px;
            border-right: 0px;
            border-bottom: none;
            margin-top: 0px;
          }

          .ideaTitle {
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

          .ideaDescrpition {
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
              font-size: 12px;
              font-weight: normal;
              font-style: normal;
              font-stretch: normal;
              line-height: 1.83;
              letter-spacing: normal;
              text-align: right;
              color: #c0b7c5;
              cursor: pointer !important;
            }
          }
        }
      }
    }
  }

  .noIdeaFoundDiv {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-content: stretch;
    height: 93vh;
    padding-bottom: 60px;
    align-items: center;

    .lampImg {
      margin-top: 15vh;
      height: 30vh;
    }

    .text {
      margin-top: 3vh;
      margin-bottom: 3vh;
      font-size: 20px;
      color: #c0b7c5;
    }

    .arrowImg {
      display: none;

      @media #{$small-screen} {
        display: block;
        width: 20%;
        margin-left: 30%;
      }
    }
  }
}
</style>
