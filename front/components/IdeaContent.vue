<template>
  <div class="d-flex flex-column fill-height" style="flex: 1;">
    <!-- eslint-disable vue/no-v-html -->
    <div
      ref="scrollContainer"
      class="idea-content content overflow-y-auto fade-bottom hide-scrollbar d-flex"
      style="flex: 1;"
      :class="{
        'idea-content-collapsed fade-bottom': isMobile ? collapsed : true,
        'idea-content': !collapsed
      }"
      v-html="content"
    ></div>
    <div v-if="!preview && !atScrollEnd" class="read-more hidden-sm-and-down">
      Read more...
    </div>
  </div>
</template>

<script>
export default {
  props: {
    collapsed: Boolean,
    preview: Boolean,
    content: { type: String, default: '' }
  },

  data() {
    return {
      atScrollEnd: false
    }
  },

  watch: {
    content(val) {
      setTimeout(() => {
        this.setAtScrollEnd(
          this.$refs.scrollContainer.scrollTop,
          this.$refs.scrollContainer.scrollHeight -
            this.$refs.scrollContainer.clientHeight
        )
      }, 300)
    }
  },

  mounted() {
    const containerElement = this.$refs.scrollContainer
    containerElement.addEventListener('scroll', e => {
      this.setAtScrollEnd(
        e.target.scrollTop,
        e.target.scrollHeight - e.target.clientHeight
      )
    })
  },

  methods: {
    setAtScrollEnd(currentScrollLocation, scrollMax) {
      this.atScrollEnd = currentScrollLocation >= scrollMax - 5
    }
  }
}
</script>

<style scoped lang="scss">
.idea-content-collapsed {
  @media (max-width: $screen-sm-max) {
    mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
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
}

::v-deep {
  a[href$='.jpg'],
  a[href$='.png'],
  a[href$='.gif'] {
    pointer-events: none;
    cursor: default;
  }

  @media (max-width: $screen-sm-max) {
    img {
      height: auto;
      max-height: 400px;
      max-width: 100%;
    }
  }
}
</style>
