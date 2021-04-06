<template>
  <lightbox
    :value="value"
    style="padding: 3rem 0.5rem 0;"
    @input="i => $emit('input', i)"
  >
    <full-idea
      :idea="idea"
      :preview="false"
      :expanded="true"
      class="idea-lightbox"
      @updated="i => $emit('updated', i)"
      @deleted="id => $emit('deleted', id)"
      @unsaved="$emit('unsaved')"
      @click.native="$vuetify.breakpoint.mdAndDown && $emit('input', false)"
      @comments-click="$emit('comments-click')"
    />
  </lightbox>
</template>

<script>
import FullIdea from '@/components/ideaDetail/FullIdea'
import Lightbox from '@/components/shared/Lightbox'

export default {
  components: {
    Lightbox,
    FullIdea
  },

  props: {
    value: { type: Boolean, required: true },
    idea: { type: Object, default: null }
  }
}
</script>

<style lang="scss" scoped>
.idea-lightbox {
  @media (min-width: $screen-md-min) {
    height: calc(100vh - 7rem);
  }
}
</style>
