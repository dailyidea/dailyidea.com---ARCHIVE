<template>
  <card @click.native="$emit('expand-idea', idea)">
    <idea-show
      :idea="idea"
      :expanded="false"
      :preview="true"
      :idea-tags="[]"
      @close="$emit('close')"
      @view-preview="$emit('view-preview', idea)"
      @unsaved="$emit('unsaved')"
      @updated="i => $emit('updated', i)"
      @deleted="id => $emit('deleted', id)"
      @expand="$emit('expand')"
      @comments-click="$emit('comments-click')"
    />
  </card>
</template>

<script>
import Card from '@/components/shared/Card'
import IdeaShow from '@/components/ideaDetail/IdeaShow'

export default {
  components: {
    IdeaShow,
    Card
  },

  props: {
    preview: Boolean,
    idea: { type: Object, required: true }
  }
}
</script>
