<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="content-container">
    <div
      ref="scroll-container"
      :class="{
        'idea-content-collapsed fade-bottom': isMobile ? collapsed : true,
        'idea-content': !collapsed
      }"
      class="content hide-scrollbar"
      v-html="content"
    ></div>
    <div v-if="!atScrollEnd" class="read-more hidden-sm-and-down">
      Read more...
    </div>
  </div>
</template>

<script>
export default {
  name: 'IdeaContent',
  props: {
    collapsed: Boolean,
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
        const scrollContainer = this.$refs['scroll-container']
        const currentScrollLocation = scrollContainer.scrollTop
        const scrollMax = scrollContainer.scrollTopMax

        this.setAtScrollEnd(currentScrollLocation, scrollMax)
      }, 300)
    }
  },

  mounted() {
    const containerElement = this.$refs['scroll-container']
    containerElement.addEventListener('scroll', e => {
      const currentScrollLocation = e.target.scrollTop
      const scrollMax = e.target.scrollTopMax
      this.setAtScrollEnd(currentScrollLocation, scrollMax)
    })
  },

  methods: {
    setAtScrollEnd(currentScrollLocation, scrollMax) {
      if (scrollMax < 100) {
        this.atScrollEnd = true
        return
      }

      if (currentScrollLocation >= scrollMax - scrollMax * 0.05) {
        this.atScrollEnd = true
      } else {
        this.atScrollEnd = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.content-container {
  position: relative;
}

.read-more {
  position: absolute;
  bottom: -2vh;
}

.idea-content-collapsed {
  max-width: 100%;
  max-height: 47vh;
  overflow-y: hidden;

  @media (max-width: $screen-sm-max) {
    max-height: 20vh;
    min-height: 20vh;
    mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
  }
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
