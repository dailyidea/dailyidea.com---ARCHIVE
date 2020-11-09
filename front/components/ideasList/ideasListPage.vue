<template>
  <Layout>
    <v-layout class="ideas-list">
      <!-- Links -->
      <section
        id="ideas-navigation-section"
        class="text-center d-none d-sm-block"
      >
        <span class="ideas-navigation-item">
          <router-link to="/ideas/all" class="muted">All Ideas</router-link>
        </span>
        <span v-if="isAuthenticated" class="ideas-navigation-item">
          <router-link to="/ideas/me" class="muted">My Ideas</router-link>
        </span>
        <span v-if="isAuthenticated" class="ideas-navigation-item">
          <router-link to="/ideas/saved" class="muted">Saved Ideas</router-link>
        </span>
      </section>

      <!-- Idea List -->
      <ideas-list
        :show-author="showAuthor"
        :ideas="ideas"
        :loading="loadingIdea"
        :allow-load-more="!!nextToken"
        :allow-order="allowOrder"
        :initial-order="initialOrder"
        @load-more="loadIdeas"
        @order-change="onChangeOrder"
      ></ideas-list>
    </v-layout>
  </Layout>
</template>

<script>
import Layout from '@/components/layout/Layout'
import IdeasList from '@/components/ideasList/ideasList'
import loadIdeas from '@/helpers/load-ideas'

export default {
  name: 'IdeasListPage',

  components: { Layout, IdeasList },

  props: {
    initialIdeas: { type: Array, default: () => [] },
    initialNextToken: { type: String, required: false, default: null },
    initialOrder: { type: String, required: false, default: undefined },
    title: { type: String, default: 'Ideas' },
    endPoint: { type: String, required: true },
    endPointName: { type: String, required: true },
    endPointMode: { type: String, required: false, default: undefined },
    endPointVariables: { type: Object, default: () => ({}) },
    showAuthor: { type: Boolean, default: false },
    allowOrder: { type: Boolean, default: true }
  },
  data() {
    return {
      ideas: [],
      nextToken: null,
      order: undefined,
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
    this.order = this.initialOrder
  },
  methods: {
    reorderIdeas() {
      this.$store.commit('layoutState/showProgressBar')
      this.loadingIdea = true
      this.ideas = []
      this.nextToken = undefined
      this.loadIdeas(true)
    },
    getLoadIdeasParams() {
      return [this.$amplifyApi, this.endPointName, this.endPoint]
    },
    onChangeOrder(val) {
      this.$router.replace({ query: { order: val } })
      this.order = val
      this.reorderIdeas()
    },
    async loadIdeas(initial = false) {
      if (!this.nextToken && !initial) {
        return
      }
      this.loadingIdea = true
      const res = await loadIdeas(
        ...this.getLoadIdeasParams(),
        Object.assign(
          { nextToken: this.nextToken, order: this.order },
          this.endPointVariables
        ),
        this.endPointMode
      )
      this.nextToken = res.nextToken
      this.ideas = this.ideas.concat(res.ideas)
      this.loadingIdea = false
      this.$store.commit('layoutState/hideProgressBar')
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';

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
    right: 95px;
    bottom: 23px;
  }
}

section#ideas-navigation-section {
  margin: 2rem auto;

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
