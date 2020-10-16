<template>
  <div>
    <v-col cols="12" :md="preview ? '' : 8" class="idea-part">
      <validation-observer v-slot="{ valid, validated, handleSubmit }">
        <div>
          <v-row class="idea-part__header" no-gutters>
            <v-col class="idea-part__header__title">
              <v-text-field-with-validation
                v-model="form.title"
                rules="required|max:100"
                label="Type your idea title"
                name="title"
                class="idea-name-field"
                :single-line="true"
                :disabled="updatingIdea"
              ></v-text-field-with-validation>
            </v-col>
          </v-row>
        </div>
        <div class="idea-part__content-container">
          <div class="idea-part__content">
            <div class="idea-part__content__idea-editor">
              <client-only>
                <trix-wrapper
                  v-model="form.content"
                  v-focus
                  class="editor"
                  placeholder="Type your idea text"
                  @attachmentsUploadStarted="onAttachmentsUploadStarted"
                  @attachmentsUploadCompleted="onAttachmentsUploadCompleted"
                  @fileAttached="onFileAttached"
                  @fileRemoved="onFileRemoved"
                />
              </client-only>
            </div>
          </div>
          <div class="idea-part__tags-panel">
            <div class="idea-part__tags-panel__tags-editor">
              <v-combobox
                v-model="form.ideaTags"
                placeholder="Add tags here"
                class="ideaTag"
                hide-details
                times
                chips
                multiple
                :disabled="updatingIdea"
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    text-color="#fff"
                    color="secondary"
                    @click="() => {}"
                    @click:close="removeTag(item)"
                  >
                    {{ item }}
                  </v-chip>
                </template>
              </v-combobox>
            </div>
          </div>
          <div class="idea-part__edit-buttons-panel">
            <v-btn text rounded @click="$emit('cancel')">Cancel</v-btn>
            <v-btn
              color="secondary"
              :loading="updatingIdea"
              rounded
              :disabled="!valid"
              @click="handleSubmit(saveIdeaContent)"
              >Save
            </v-btn>
          </div>
        </div>
      </validation-observer>
    </v-col>
    <visual-notifier ref="notifier"></visual-notifier>
  </div>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import { ValidationObserver } from 'vee-validate'
import { mapGetters } from 'vuex'
import pick from 'lodash/pick'
import merge from 'lodash/merge'
import TrixWrapper from '@/components/TrixWrapper'
import VisualNotifier from '@/components/VisualNotifier'
import updateIdea from '@/graphql/mutations/updateIdea'
import VTextFieldWithValidation from '@/components/validation/VTextFieldWithValidation'

export default {
  components: {
    ValidationObserver,
    TrixWrapper,
    VTextFieldWithValidation,
    VisualNotifier
  },

  props: {
    idea: { type: Object, required: true },
    ideaTags: { type: Array, default: () => [] },
    preview: { type: Boolean, default: false },
    expanded: { type: Boolean, default: false }
  },

  data() {
    return {
      updatingIdea: false,
      showRegisterEncourageDialog: false,
      form: {
        title: '',
        ideaTags: [],
        fileAttachments: [],
        imageAttachments: [],
        content: ''
      }
    }
  },

  computed: {
    ...mapGetters({
      userId: 'userData/userId'
    })
  },

  mounted() {
    this.form = pick(this.idea, ['title', 'content'])
    this.form.ideaTags = merge([], this.ideaTags)
    this.form.imageAttachments = merge([], this.idea.imageAttachments)
    this.form.fileAttachments = merge([], this.idea.fileAttachments)
  },

  methods: {
    removeTag(item) {
      this.ideaEditData.ideaTags.splice(
        this.ideaEditData.ideaTags.indexOf(item),
        1
      )
    },

    onFileAttached({ type, key }) {
      if (!this.editMode) {
        return
      }
      if (type.substr(0, 5) === 'image') {
        this.ideaEditData.imageAttachments.push(key)
      }
      this.ideaEditData.fileAttachments.push(key)
    },

    onFileRemoved({ type, key }) {
      if (!this.editMode) {
        return
      }
      if (type.substr(0, 5) === 'image') {
        this.ideaEditData.imageAttachments.splice(
          this.ideaEditData.imageAttachments.indexOf(key),
          1
        )
      }
      this.ideaEditData.fileAttachments.splice(
        this.ideaEditData.fileAttachments.indexOf(key),
        1
      )
    },

    onAttachmentsUploadStarted() {
      this.updatingIdea = true
    },

    onAttachmentsUploadCompleted() {
      this.updatingIdea = false
    },

    saveIdeaContent() {
      this.updatingIdea = true
      setTimeout(async () => {
        try {
          const resp = await this.$amplifyApi.graphql(
            graphqlOperation(updateIdea, {
              ideaId: this.idea.ideaId,
              ideaOwnerId: this.idea.userId,
              content: this.form.content,
              title: this.form.title,
              tags: this.form.ideaTags,
              imageAttachments: this.form.imageAttachments,
              fileAttachments: this.form.fileAttachments
            })
          )
          this.$emit('updated', merge({}, this.form))
          this.$refs.notifier.success('Idea Updated!')
          // Redirect to updated URL slug if needed
          if (resp.data.updateIdea.idea.slug !== this.idea.slug) {
            this.$router.replace({
              name: 'i-shortId-slug',
              params: {
                shortId: this.idea.shortId,
                slug: resp.data.updateIdea.idea.slug
              }
            })
          }
        } catch (e) {
          this.$refs.notifier.error("Can't update Idea!")
        }
        this.updatingIdea = false
      }, 10) // if last tag not saved yet editor needs time to process outer click event
    }
  }
}
</script>

<style scoped lang="scss">
.comments-section {
  display: flex;
  align-items: flex-end;
}

.pointer {
  cursor: pointer;
}

.idea-name-field {
  font-size: 24px;
}

.idea-date {
  margin-top: 2px;
}

.idea-part {
  position: relative;

  @media (min-width: $screen-md-min) {
    padding: 8px 16px;
  }

  &__idea-content {
    @media only screen and (min-width: $screen-md-min) {
      overflow-y: auto;
    }
  }

  &__content-container {
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
    }

    &__tags-editor {
      ::v-deep .v-input__icon {
        display: none;
      }
    }
  }
}
</style>
