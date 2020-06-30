<template>
  <!-- eslint-disable vue/no-v-html -->
  <div v-if="!preview" class="idea-content" v-html="content"></div>
  <div v-else class="idea-content">{{ strippedContent }}</div>
</template>

<script>
export default {
  name: 'IdeaContent',
  props: {
    content: {
      type: String,
      default: ''
    },

    preview: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    strippedContent() {
      return this.content.replace(/(<([^>]+)>)/gi, '')
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
  blockquote {
    margin: 0.3em 0 0.3em 0.3em;
    padding: 0 0 0 0.6em;
    border-left: 0.3em solid #a7a2a2;
    color: #a7a2a2;
  }
  pre {
    display: inline-block;
    width: 100%;
    vertical-align: top;
    font-family: monospace;
    font-size: 0.9em;
    margin: 0;
    padding: 0.5em;
    white-space: pre;
    background-color: #eee;
    overflow-x: auto;
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
