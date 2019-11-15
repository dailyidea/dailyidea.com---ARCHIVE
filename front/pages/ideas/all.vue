<template>
  <Layout
    v-bind="{
      currentPage: 'IdeaList',
      pageOptions: mobileHeaderUiOptions
    }"
  >
    <v-layout id="ideaListPage">
      <!-- Title Section -->
      <div class="titleDiv">
        <v-layout class="titleText" hidden-sm-and-down>ALL IDEAS</v-layout>
      </div>

      <!-- Sort Button -->
      <div v-if="ideas && ideas.length > 0" class="sortBy">
        <v-icon>fas fa-clock</v-icon>Sort by Newest
      </div>

      <!-- Idea List -->
      <IdeaListComponent :ideas="ideas"></IdeaListComponent>

      <!-- LodaMore Button -->
      <div v-if="ideas && ideas.length > 0" class="loadMoreBtn">
        <v-btn v-if="nextToken" :loading="loadingIdea" @click="loadMoreIdea()">
          Load More
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

import getPublicIdeas from '~/graphql/query/getPublicIdeas'
import Layout from '@/components/layout/Layout'
import IdeaListComponent from '@/components/ideaList'

const pageSize = 25

export default {
  components: { Layout, IdeaListComponent },

  async asyncData({ app }) {
    let result = await app.$amplifyApi.graphql({
      query: getPublicIdeas,
      variables: {
        nextToken: null,
        limit: pageSize
      },
      authMode: 'API_KEY'
    })

    result = result.data.getPublicIdeas
    return {
      // Set next token for next batch of ideas
      nextToken: result.nextToken,
      // Set ideas
      ideas: result.items
    }
  },

  data: () => ({
    mobileHeaderUiOptions: {
      pageTitle: 'ALL IDEAS',
      leftButtonType: 'hamburder'
    },
    snackbarVisible: false,
    snackbarMessage: '',
    snackbarColor: 'success',
    loadingIdea: false,

    nextToken: null,
    pagesize: pageSize
  }),
  created() {
  },

  methods: {
    async loadMoreIdea() {
      this.loadingIdea = true

      if (!this.nextToken) {
        return
      }

      const result = await this.$amplifyApi.graphql({
        query: getPublicIdeas,
        variables: {
          nextToken: this.nextToken,
          limit: this.pagesize
        },
        authMode: 'API_KEY'
      })
      const ideas = result.data.getPublicIdeas

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
