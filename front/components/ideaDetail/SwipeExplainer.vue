<template>
  <card class="card" :additional-styling="additionalStyling">
    <v-col cols="12" class="idea-part">
      <v-row class="idea-part__header no-gutters" no-gutters>
        <v-col class="idea-part__header__title">
          <h2 class="idea-part__header__title__label">
            Welcome to Daily Idea!
          </h2>
        </v-col>
      </v-row>
      <div class="idea-part__content-container">
        <div class="idea-part__content">
          <div class="idea-part__idea-content hide-scrollbar fade-bottom">
            <div class="mb-4">
              Welcome to the idea creating community, introduce yourself in the
              comments!
            </div>
            <div class="mb-4">
              Image here
            </div>
            <div>
              Then get started exploring ideas, click on the right arrow to see
              the next idea, and the left arrow to see previous one. Give it a
              try now!
            </div>
          </div>
        </div>
      </div>
    </v-col>
  </card>
</template>

<script>
import Card from '@/components/shared/Card'

export default {
  components: { Card },

  props: {
    additionalStyling: { type: Object, default: Object }
  },

  data() {
    return { isExpandedState: false }
  },

  computed: {
    isExpanded: {
      set(state) {
        this.$emit('toggle-expand', state)
        this.isExpandedState = state
      },

      get() {
        if (this.expanded) {
          return true
        }

        return this.isMobile ? this.isExpandedState : true
      }
    }
  },

  methods: {
    //
  }
}
</script>

<style scoped lang="scss">
.card {
  height: 60vh;
}

.idea-part {
  position: relative;

  &__idea-content {
    @media only screen and (min-width: $screen-md-min) {
      overflow-y: auto;
      min-height: 46vh;
      max-height: 46vh;
    }
  }

  &__header {
    &__title {
      text-transform: capitalize;
      &__label {
        font-weight: 100;
      }
    }
  }
}
</style>
