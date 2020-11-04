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
      @updated="i => $emit('updated', i)"
      @click.native="$emit('input', false)"
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
