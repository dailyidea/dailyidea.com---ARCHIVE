<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    :class="{
      'idea-content-collapsed fade-bottom': isMobile ? collapsed : true,
      'idea-content': !collapsed
    }"
    class="hide-scrollbar"
    v-html="content"
  ></div>
</template>

<script>
export default {
  name: 'IdeaContent',
  props: {
    collapsed: Boolean,
    content: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.idea-content-collapsed {
  max-width: 100%;
  max-height: 47vh;
  @media (max-width: $screen-sm-max) {
    max-height: 35vh;
    -webkit-mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
    mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
  }
  overflow-y: hidden;
}

.idea-content {
  max-width: 100%;

  @media only screen and (min-width: $screen-md-min) {
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 2rem;
  }
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
::v-deep {
  a[href$='.jpg'] {
    pointer-events: none;
    cursor: default;
  }
}
</style>
