<template>
  <v-dialog
    content-class="modal"
    :value="value"
    max-width="600"
    @input="v => $emit('input', v)"
  >
    <div class="closeBtn">
      <v-icon text class="cancelIcon" @click="$emit('input', false)"
        >mdi-close</v-icon
      >
    </div>

    <idea-comments v-if="value" :idea="idea" />
  </v-dialog>
</template>

<script>
import IdeaComments from '@/components/ideaDetail/IdeaComments'

export default {
  components: { IdeaComments },

  props: {
    value: Boolean,
    idea: { type: Object, required: true }
  },

  data: () => ({ name: '' }),

  methods: {
    onOk() {
      this.$emit('data', this.name)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .modal {
    max-height: 100%;
    overflow-y: auto;
  }
}
</style>
