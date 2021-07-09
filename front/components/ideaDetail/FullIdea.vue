<template>
  <div class="fill-width fill-height d-flex justify-center overflow-hidden">
    <idea-show
      :idea="idea"
      :preview="preview"
      :idea-tags="ideaTags"
      :expanded="expanded"
      @close="$emit('close')"
      @view-preview="$emit('view-preview')"
      @updated="onUpdate"
      @deleted="id => $emit('deleted', id)"
      @unsaved="$emit('unsaved')"
      @expand="$emit('expand')"
      @comments-click="$emit('comments-click')"
    />
  </div>
</template>

<script>
import merge from 'lodash/merge'
import IdeaShow from '@/components/ideaDetail/IdeaShow'
import getIdeaTags from '@/graphql/query/getIdeaTags'

export default {
  components: {
    IdeaShow
  },

  props: {
    preview: Boolean,
    expanded: Boolean,
    idea: { type: Object, required: true }
  },

  data() {
    return {
      ideaTags: []
    }
  },

  mounted() {
    this.loadIdeaTags()
    if (this.$route.query.comment) {
      setTimeout(() => this.commentsBtnClick(), 500)
    }
  },

  methods: {
    expandToggle() {
      if (this.expanded || !this.isMobile) {
        return
      }
      this.isExpanded = !this.isExpanded
      this.$emit('expand-toggle', this.isExpanded)
    },

    async loadIdeaTags() {
      const ideaTags = []
      if (this.$store.getters['cognito/isLoggedIn']) {
        const tag = await this.$amplifyApi.graphql({
          query: getIdeaTags,
          variables: { ideaId: this.idea.ideaId }
        })

        for (let i = 0; i < tag.data.ideaTags.length; i++) {
          ideaTags.push(tag.data.ideaTags[i].tag)
        }
      }
      this.ideaTags = ideaTags
    },

    onUpdate(idea) {
      this.$emit('updated', merge({}, this.idea, idea))
    }
  }
}
</script>
