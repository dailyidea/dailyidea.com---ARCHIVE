<template>
  <swipable-card class="absolute" @click.native="$emit('expand')">
    <full-idea
      :idea="idea"
      :preview="preview"
      :expanded="$vuetify.breakpoint.lgAndUp"
      @expand="$emit('expand')"
      @updated="i => $emit('updated', i)"
      @deleted="id => $emit('deleted', id)"
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
    idea: { type: Object, required: true }
  }
}
</script>
