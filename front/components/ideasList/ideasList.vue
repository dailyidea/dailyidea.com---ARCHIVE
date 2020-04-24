<template>
  <div class="ideas-list">
    <!-- Sort Button -->
    <div
      v-if="allowOrder && ((ideas && ideas.length > 0) || loading)"
      class="ideas-list__sort-by-panel"
    >
      <v-menu left>
        <template v-slot:activator="{ on }">
          <span v-on="on">
            <span>{{ selectedOrder.title }}</span>
            <v-icon size="16">fas fa-exchange-alt fa-rotate-90</v-icon>
          </span>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in orderOptions"
            :key="index"
            @click="onChangeOrder(item.code)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
      v-else-if="!loading"
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
import { ORDER } from '@/components/ideasList/ideasOrdering'

const orderOptions = [
  { title: 'Sort by Newest', code: ORDER.DATE_DESC },
  { title: 'Sort by Oldest', code: ORDER.DATE_ASC },
  { title: 'Most Popular', code: ORDER.LIKES },
  { title: 'Most Commented', code: ORDER.COMMENTS },
  { title: 'Alphabetically Up', code: ORDER.TITLE_ASC },
  { title: 'Alphabetically Down', code: ORDER.TITLE_DESC }
]

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
    },
    initialOrder: {
      type: String,
      default: ORDER.DATE_DESC
    },
    allowOrder: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectedOrder: orderOptions.filter(o => o.code === this.initialOrder)[0],
      orderOptions
    }
  },
  computed: {},
  methods: {
    onChangeOrder(val) {
      this.selectedOrder = orderOptions.filter(o => o.code === val)[0]
      this.$emit('order-change', val)
    },
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
    cursor: pointer;
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
