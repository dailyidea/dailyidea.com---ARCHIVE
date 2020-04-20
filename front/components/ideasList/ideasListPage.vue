<template>
  <Layout>
    <v-layout class="ideas-list">

      <!-- Links -->
      <section id="ideas-navigation-section" class="text-center d-none d-sm-block">
        <span class="ideas-navigation-item">
          <router-link to="/ideas/all">All Ideas</router-link>
        </span>
        <span v-if="isAuthenticated" class="ideas-navigation-item">
          <router-link to="/ideas/me">My Ideas</router-link>
        </span>
        <span v-if="isAuthenticated" class="ideas-navigation-item">
          <router-link to="/ideas/liked">Saved Ideas</router-link>
        </span>
      </section>

      <!-- Idea List -->
      <ideas-list
        :show-author="showAuthor"
        :ideas="ideas"
        :loading="loadingIdea"
        :allow-load-more="!!nextToken"
        @load-more="loadMoreIdeas"
      ></ideas-list>

      <!-- Add Idea Button -->
      <v-btn class="addBtn" fab to="/ideas/create">
        <v-icon>add</v-icon>
      </v-btn>

      <!-- Bottom snackbar message -->
      <visual-notifier ref="notifier"></visual-notifier>
    </v-layout>
  </Layout>
</template>

<script>
import Layout from '@/components/layout/Layout'
import IdeasList from '@/components/ideasList/ideasList'
import VisualNotifier from '@/components/VisualNotifier'
import loadIdeas from '@/components/ideasList/loadIdeas'

export default {
  name: 'IdeasListPage',
  components: { Layout, IdeasList, VisualNotifier },
  props: {
    initialIdeas: {
      type: Array,
      default: () => []
    },
    initialNextToken: {
      type: String,
      required: false,
      default: null
    },
    title: {
      type: String,
      default: 'Ideas'
    },
    endPoint: {
      type: String,
      required: true
    },
    endPointName: {
      type: String,
      required: true
    },
    endPointMode: {
      type: String,
      required: false,
      default: undefined
    },
    endPointVariables: {
      type: Object,
      default: () => ({})
    },
    showAuthor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ideas: [],
      nextToken: null,

      loadingIdea: false
    }
  },
  computed: {
    mobileHeaderUiOptions() {
      return {
        pageTitle: this.title
      }
    },
    isAuthenticated() {
      return this.$store.state.userData.isAuthenticated
    }
  },
  created() {
    this.ideas = this.initialIdeas
    this.nextToken = this.initialNextToken
  },
  methods: {
    getLoadIdeasParams() {
      return [this.$amplifyApi, this.endPointName, this.endPoint]
    },
    async loadMoreIdeas() {
      if (!this.nextToken) {
        return
      }
      this.loadingIdea = true
      const res = await loadIdeas(
        ...this.getLoadIdeasParams(),
        Object.assign({ nextToken: this.nextToken }, this.endPointVariables),
        this.endPointMode
      )
      this.nextToken = res.nextToken
      this.ideas = this.ideas.concat(res.ideas)
      this.loadingIdea = false
    }
  }
}
</script>

<style scoped lang="scss">
.ideas-list {
  /*padding-top: 50px;*/
  background: white;
  padding-bottom: 2vh;
  display: block;

  @media #{$small-screen} {
    padding-top: 0;
  }

  .addBtn {
    position: fixed;
    right: 40px;
    bottom: 30px;
  }
}

section#ideas-navigation-section {
  margin: 3rem auto;

  .ideas-navigation-item {
    &:not(:last-child) {
      @media (min-width: $screen-sm-min) and (max-width: $screen-md-max) {
        margin-right: 2rem;
      }
      @media (min-width: $screen-lg-min) {
        margin-right: 3rem;
      }
    }

    a {
      text-decoration: none;

      &.nuxt-link-active {
        color: $primary-color;
        font-weight: bold;
        border-bottom: 2px solid $primary-color;
      }
    }
  }
}
</style>
