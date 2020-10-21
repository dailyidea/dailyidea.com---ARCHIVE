<template>
  <div class="header-container d-flex flex-row align-center">
    <div class="header-sub-container d-flex flex-row">
      <span
        class="link"
        :class="{ active: category === 'top' }"
        @click="emitCategoryClicked('top')"
      >
        <span :class="{ 'link-highlight mt-1': category === 'top' }">Top</span>
      </span>
      <span
        class="link"
        :class="{ active: category === 'new' }"
        @click="emitCategoryClicked('new')"
      >
        <span :class="{ 'link-highlight mt-1': category === 'new' }">New</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoriesSubHeader',
  props: {
    categorySelected: { type: String, required: true }
  },

  computed: {
    category() {
      switch (this.categorySelected) {
        case 'new':
          return 'new'
        default:
          return 'top'
      }
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
.header-container {
  width: 100%;
  height: 100%;
  background-color: white;
  height: 60px;

  .header-sub-container {
    width: 92%;
    height: 100%;
    margin: 0 auto;

    .link {
      position: relative;
      z-index: 1000;
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
