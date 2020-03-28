<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="idea-content" v-html="content"></div>
</template>

<script>
export default {
  name: 'IdeaContent',
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.idea-content {
  max-width: 100%;
}
.idea-content ::v-deep {
  h1 {
    font-size: 22px;
    line-height: 25px;
  }
  textarea,
  .trix-button {
    display: none;
  }
  img {
    height: auto !important;
    width: auto !important;
  }
  @media (min-width: $screen-md-min) {
    img {
      max-height: 500px;
      max-width: 80%;
    }
  }
  @media (max-width: $screen-sm-max) {
    img {
      max-height: 400px;
      max-width: 100%;
    }
  }
}
</style>
