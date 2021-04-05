<template>
  <div class="header-container d-flex flex-row align-center">
    <sliding-underline class="d-block header-sub-container d-flex flex-row">
      <span
        class="link"
        :class="{ active: category === 'new' }"
        @click="emitCategoryClicked('new')"
      >
        <span :class="{ 'link-highlight': category === 'new' }">New</span>
      </span>
      <span
        class="link"
        :class="{ active: category === 'top' }"
        @click="emitCategoryClicked('top')"
      >
        <span :class="{ 'link-highlight': category === 'top' }">Top</span>
      </span>
    </sliding-underline>
  </div>
</template>

<script>
import SlidingUnderline from '@/components/layout/SlidingUnderline'

export default {
  name: 'CategoriesSubHeader',
  components: { SlidingUnderline },
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
      z-index: 1;
      margin-right: 1.5rem;
      cursor: pointer;
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
}
</style>
