<template>
  <Layout
    v-bind="{
      loggedInHeader: true,
      mobileTitle: 'My Ideas',
      mobileHamburger: true,
      mobileSearchIcon: true,
      desktopMenuVisible: true,
      showEditIdeaBtn: false
    }"
  >
    <v-layout id="ideaListPage">
      <!-- Title Section -->
      <div class="titleDiv">
        <v-layout class="titleText" hidden-sm-and-down>MY IDEAS</v-layout>
      </div>

      <!-- Sort Button -->
      <div v-if="ideas && ideas.length > 0" class="sortBy">
        <v-icon>fas fa-clock</v-icon>Sort by Newest
      </div>

      <!-- Idea List -->
      <IdeaListComponent
        :ideas="ideas"
        :show-arrow-to-add-button="true"
      ></IdeaListComponent>

      <!-- LodaMore Button -->
      <div v-if="ideas && ideas.length > 0" class="loadMoreBtn">
        <v-btn v-if="nextToken" :loading="loadingIdea" @click="loadMoreIdea()">
          Load More Idea
        </v-btn>
      </div>

      <!-- Add Idea Button -->
      <v-btn class="addBtn" fab to="/ideas/create">
        <v-icon>add</v-icon>
      </v-btn>

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

import getIdeas from '~/graphql/query/getIdeas'
import Layout from '@/components/layout/Layout'
import IdeaListComponent from '@/components/ideaList'
dayjs.extend(relativeTime)

export default {
  components: { Layout, IdeaListComponent },

  data: () => ({
    snackbarVisible: false,
    snackbarMessage: '',
    snackbarColor: 'success',
    loadingIdea: false
  }),

  async asyncData({ app, store }) {
    const {
      data: { ideas }
    } = await app.$amplifyApi.graphql(
      graphqlOperation(getIdeas, { nextToken: null, limit: 10 })
    )

    // Add logged in user's id in all ideas
    let ideaList = ideas.items
    let loggedInUserId = store.getters['cognito/userSub']
    for (let i = 0; i < ideaList.length; i++) {
      ideaList[i].userId = loggedInUserId
    }

    return {
      // Set next token for next batch of ideas
      nextToken: ideas.nextToken,
      // Set ideas
      ideas: ideaList
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
  padding-bottom: 2vh;
  display: block;
  overflow-x: hidden;

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
      color: #232323;
    }
  }

  .sortBy {
    margin-left: 26%;
    margin-bottom: 15px;
    font-size: 14px;
    color: #35124e;

    @media #{$small-screen} {
      font-size: 12px;
      padding-top: 10px;
      margin-left: 15px;
    }

    i {
      font-size: 17px;
      padding-right: 7px;
    }
  }

  .addBtn {
    position: fixed;
    right: 40px;
    bottom: 30px;
  }

  .loadMoreBtn {
    padding-top: 20px;
    text-align: center;
  }
}
</style>
