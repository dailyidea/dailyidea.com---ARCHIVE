<template>
  <div class="ideas-list">
    <!-- Sort Button -->
    <div v-if="ideas && ideas.length > 0" class="ideas-list__sort-by-panel">
      <v-icon>fas fa-clock</v-icon>
      Sort by Newest
    </div>

    <div v-if="ideas && ideas.length">
      <ideas-list-idea
        v-for="idea in ideas"
        :key="idea.ideaId"
        :idea="idea"
      ></ideas-list-idea>
    </div>

    <ideas-list-empty-message
      v-else
      :show-arrow-to-add-button="true"
    ></ideas-list-empty-message>
    <!-- LoadMore Button -->
    <div v-if="allowLoadMore" class="ideas-list__load-more-button-panel">
      <v-btn :loading="loading" @click="loadMore()">
        Load More
      </v-btn>
    </div>
  </div>
</template>

<script>
import ideasListIdea from './ideasListIdea'
import ideasListEmptyMessage from './ideasListEmptyMessage'

export default {
  name: 'IdeasList',
  components: { ideasListIdea, ideasListEmptyMessage },
  props: {
    ideas: Array,
    allowLoadMore: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    loadMore() {
      this.$emit('load-more')
    }
  }
}
</script>

<style scoped lang="scss">
.ideas-list {
  @media (min-width: $screen-lg-min) {
    margin-left: 25%;
    margin-right: 25%;
  }
  @media (min-width: $screen-md-min) and (max-width: $screen-md-max) {
    margin-left: 15%;
    margin-right: 15%;
  }

  &__sort-by-panel {
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

  &__load-more-button-panel {
    padding-top: 20px;
    text-align: center;
  }
}
</style>
