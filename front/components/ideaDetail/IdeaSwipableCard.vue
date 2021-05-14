<template>
  <swipable-card
    :expanded="expanded"
    :prevent-mobile-scroll="!expanded"
    class="d-flex flex-column"
    @collapse="$emit('collapse')"
    @expanded-transition-end="$emit('expanded-transition-end')"
  >
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
