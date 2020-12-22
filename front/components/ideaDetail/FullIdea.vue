<template>
  <div class="fill-width fill-height">
    <idea-edit
      v-if="editMode"
      :idea="idea"
      :idea-tags="ideaTags"
      class="fill-height overflow-y-auto"
      @updated="onUpdate"
      @cancel="editMode = false"
    />
    <idea-show
      v-else
      :idea="idea"
      :expanded="expanded"
      :preview="preview"
      :idea-tags="ideaTags"
      @edit="editMode = true"
      @close="$emit('close')"
      @view-preview="$emit('view-preview')"
      @updated="onUpdate"
      @deleted="id => $emit('deleted', id)"
      @expand="$emit('expand')"
    />
  </div>
</template>

<script>
import merge from 'lodash/merge'
import IdeaShow from '@/components/ideaDetail/IdeaShow'
import IdeaEdit from '@/components/ideaDetail/IdeaEdit'
import getIdeaTags from '@/graphql/query/getIdeaTags'

export default {
  components: {
    IdeaEdit,
    IdeaShow
  },

  props: {
    preview: Boolean,
    idea: { type: Object, required: true },
    expanded: { type: Boolean, default: false }
  },

  data() {
    return {
      ideaTags: [],
      editMode: false
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
      this.editMode = false
    }
  }
}
</script>
