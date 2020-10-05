<template>
  <div class="header-container d-flex flex-row align-center">
    <div class="header-sub-container d-flex flex-row">
      <span
        class="link"
        :class="{ 'link-highlight active': category === 'top' }"
        @click="emitCategoryClicked('top')"
      >
        Top
      </span>
      <span
        class="link"
        :class="{ 'link-highlight active': category === 'new' }"
        @click="emitCategoryClicked('new')"
      >
        New
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoriesSubHeader',
  props: {
    categorySelected: {
      type: String,
      required: true
    }
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
    margin: 0 auto;

    .link {
      position: relative;
      z-index: 1000;
      margin-right: 1.5rem;
      cursor: pointer;
    }

    .active {
      border-bottom: 3px solid $secondary-color;
    }
  }
}
</style>
