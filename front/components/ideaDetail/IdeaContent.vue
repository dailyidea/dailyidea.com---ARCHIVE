<template>
  <div
    class="d-flex flex-column fill-height overflow-hidden"
    style="flex: 1;"
    :class="{ preview }"
  >
    <!-- eslint-disable vue/no-v-html -->
    <div
      ref="scrollContainer"
      class="idea-content content overflow-y-auto fade-bottom hide-scrollbar"
      style="flex: 1;"
      :class="{
        'idea-content-collapsed fade-bottom': isMobile ? collapsed : true,
        'idea-content': !collapsed
      }"
      v-html="content"
    ></div>
    <div
      v-if="!atScrollEnd"
      class="hidden-sm-and-down cursor-pointer"
      style="user-select: none;"
      @click="$refs.scrollContainer.scrollTop += 20"
    >
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
      atScrollEnd: true
    }
  },

  watch: {
    content() {
      setTimeout(() => this.setAtScrollEnd(), 300)
    }
  },

  mounted() {
    this.$refs.scrollContainer.addEventListener('scroll', () => {
      this.setAtScrollEnd()
    })
    setTimeout(() => this.setAtScrollEnd(), 300)
  },

  methods: {
    setAtScrollEnd() {
      if (!this.$refs.scrollContainer) {
        return
      }
      const $el = this.$refs.scrollContainer
      const currentScrollLocation = $el.scrollTop
      const scrollMax = $el.scrollHeight - $el.clientHeight

      this.atScrollEnd = currentScrollLocation >= scrollMax - 5
    }
  }
}
</script>

<style scoped lang="scss">
.preview {
  max-height: 200px;
}

.idea-content-collapsed {
  @media (max-width: $screen-sm-max) {
    mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
  }
}

.idea-content {
  padding-bottom: 5px;
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
