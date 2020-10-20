<template>
  <card
    :class="{ 'fixed-height': !isExpanded && !preview }"
    :additional-styling="additionalStyling"
    :prevent-mobile-scroll="!isExpanded && !allowMobileScroll"
    @click="expandToggle"
  >
    <v-icon v-if="closeBtn" class="close-btn" @click="$emit('exit-pressed')"
      >mdi mdi-close</v-icon
    >
    <idea-edit
      v-if="editMode"
      :idea="idea"
      :idea-tags="ideaTags"
      @updated="onUpdate"
      @cancel="editMode = false"
    />
    <idea-show
      v-else
      :idea="idea"
      :expanded="isExpanded"
      :preview="preview"
      :idea-tags="ideaTags"
      @edit="editMode = true"
      @close="isExpanded = false"
      @view-preview="$emit('view-preview')"
      @updated="onUpdate"
    />
  </card>
</template>

<script>
import merge from 'lodash/merge'
import Card from '@/components/shared/Card'
import IdeaShow from '@/components/ideaDetail/IdeaShow'
import IdeaEdit from '@/components/ideaDetail/IdeaEdit'
import getIdeaTags from '@/graphql/query/getIdeaTags'

export default {
  components: {
    IdeaEdit,
    IdeaShow,
    Card
  },

  props: {
    preview: Boolean,
    idea: { type: Object, required: true },
    additionalStyling: { type: Object, default: Object },
    expanded: { type: Boolean, default: false },
    closeBtn: { type: Boolean, default: false },
    allowMobileScroll: { type: Boolean, default: false }
  },

  data() {
    return {
      ideaTags: [],
      isExpanded: false,
      editMode: false
    }
  },

  mounted() {
    this.loadIdeaTags()
    if (this.$route.query.comment) {
      setTimeout(() => this.commentsBtnClick(), 500)
    }
    this.isExpanded = this.isMobile ? this.expanded : true
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

<style lang="scss" scoped>
.close-btn {
  position: absolute;
  z-index: 1001;
  top: 10px;
  right: 10px;
  color: $primary-color;
  font-size: 20px;

  @media (max-width: $screen-sm-max) {
    left: 10px;
    justify-content: start;
  }
}
</style>
