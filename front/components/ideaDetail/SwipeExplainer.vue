<template>
  <idea-card :additional-styling="additionalStyling" class="welcome-card">
    <v-col cols="12" :md="preview ? '' : 8" class="idea-part">
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
  </idea-card>
</template>

<script>
import IdeaCard from '@/components/ideaDetail/IdeaCard'

export default {
  components: {
    IdeaCard
  },

  props: {
    additionalStyling: {
      type: Object,
      default: Object
    },

    allowMobileScroll: {
      type: Boolean,
      default: false
    },

    closeBtn: {
      type: Boolean,
      default: false
    },

    preview: {
      type: Boolean,
      default: Boolean
    },

    expanded: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isExpandedState: false
    }
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
.welcome-card {
  min-height: 55vh;
  max-height: 55vh;
}

.comments-section {
  display: flex;
  align-items: flex-end;
}

.pointer {
  cursor: pointer;
}

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

.idea-name-field {
  font-size: 24px;
}

.idea-date {
  margin-top: 2px;
}

.idea-link {
  text-decoration: none;
}

.idea-part {
  position: relative;

  &__author-avatar {
    width: 24px;
    margin-bottom: 5px;
    border-radius: 100%;
  }

  &__info {
    &__author {
      &__link {
        text-transform: capitalize;
        text-decoration: none;
        color: $disabled-purple;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  &__idea-content {
    @media only screen and (min-width: $screen-md-min) {
      overflow-y: auto;
      min-height: 46vh;
      max-height: 46vh;
    }
  }

  &__content-container {
    word-break: break-word;
    margin-top: 1rem;
    &__idea-editor {
      ::v-deep .trix-content {
        overflow-y: auto;
      }
    }
  }

  &__edit-buttons-panel {
    text-align: right;
    margin: 10px 0;
    padding: 0 5px;
  }

  &__header {
    &__title {
      text-transform: capitalize;
      &__label {
        font-weight: 100;
      }
    }
  }

  &__tags-panel {
    /*border-top: 1px solid #ebe7ed;*/
    /*padding-left: 10px;*/

    .tagsContainer {
      margin-top: 20px;

      .tag {
        margin: 4px;
        background-color: white;
        color: $disabled-purple;
        border-radius: 5px;
        border: 1px solid $disabled-purple;
      }
    }

    &__tags-editor {
      ::v-deep .v-input__icon {
        display: none;
      }
    }
  }
}
</style>
