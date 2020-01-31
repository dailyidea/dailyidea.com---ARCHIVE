<template>
  <div class="ideas-list">
    <!-- Sort Button -->
    <div v-if="ideas && ideas.length > 0" class="ideas-list__sort-by-panel">
      <span>Sort by Newest</span>
      <v-icon size="16">fas fa-exchange-alt fa-rotate-90</v-icon>
    </div>

    <div v-if="ideas && ideas.length">
      <ideas-list-idea
        v-for="idea in ideas"
        :key="idea.ideaId"
        :idea="idea"
        :show-author="showAuthor"
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
    ideas: {
      type: Array,
      required: true
    },
    allowLoadMore: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    showAuthor: {
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
@import '~assets/style/common';
.ideas-list {
  $main-text-color: #4a4a4a;
  @include pageMargin;

  &__sort-by-panel {
    vertical-align: middle;
    margin-bottom: 10px;
    font-size: 16px;
    text-align: right;
    color: $main-text-color;

    @media #{$small-screen} {
      font-size: 12px;
      padding-top: 10px;
      margin-left: 15px;
    }
  }

  &__load-more-button-panel {
    padding-top: 20px;
    text-align: center;
  }
}
</style>
