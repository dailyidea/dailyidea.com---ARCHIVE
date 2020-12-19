<template>
  <div class="header-container d-flex flex-row align-center">
    <div class="header-sub-container d-flex flex-row">
      <span
        class="link"
        :class="{ active: category === 'new' }"
        @click="emitCategoryClicked('new')"
      >
        <span :class="{ 'link-highlight mt-1': category === 'new' }">New</span>
      </span>
      <span
        class="link"
        :class="{ active: category === 'top' }"
        @click="emitCategoryClicked('top')"
      >
        <span :class="{ 'link-highlight mt-1': category === 'top' }">Top</span>
      </span>
      <v-select
        v-if="category === 'top'"
        v-model="topOption"
        :items="topOptions"
        class="top-selector"
      ></v-select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    category: { type: String, required: true }
  },

  data: () => ({
    topOption: 'all',
    topOptions: [
      {
        value: 'day',
        text: 'Today'
      },
      {
        value: 'week',
        text: 'This Week'
      },
      {
        value: 'month',
        text: 'This Month'
      },
      {
        value: 'year',
        text: 'This Year'
      },
      {
        value: 'all',
        text: 'All Time'
      }
    ]
  }),

  watch: {
    topOption(val) {
      this.$emit('top-option', val)
    }
  },

  methods: {
    emitCategoryClicked(category) {
      this.$emit('category-clicked', category)
    }
  }
}
</script>

<style scoped lang="scss">
.top-selector {
  flex: 0 1 120px;
}

.header-container {
  width: 100%;
  background-color: white;
  height: 60px;

  .header-sub-container {
    width: 92%;
    height: 100%;
    margin: 0 auto;

    @media (min-width: $screen-md-min) {
      max-width: 70vw;
    }

    .link {
      position: relative;
      z-index: 10;
      margin-right: 1.5rem;
      cursor: pointer;
      height: 100%;
      display: flex;
      flex-direciton: row;
      align-items: center;
    }

    .active {
      border-bottom: 3px solid $secondary-color;
    }
  }
}
</style>
