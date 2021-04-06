<template>
  <swipable-card :expanded="expanded" @collapse="$emit('collapse')">
    <full-idea
      :idea="idea"
      :preview="preview"
      :expanded="expanded"
      @expand="$emit('expand')"
      @updated="i => $emit('updated', i)"
      @deleted="id => $emit('deleted', id)"
      @comments-click="$emit('comments-click')"
    />
  </swipable-card>
</template>

<script>
import SwipableCard from '@/components/shared/SwipableCard'
import FullIdea from '@/components/ideaDetail/FullIdea'

export default {
  components: {
    FullIdea,
    SwipableCard
  },

  props: {
    preview: Boolean,
    expanded: Boolean,
    idea: { type: Object, required: true }
  }
}
</script>
