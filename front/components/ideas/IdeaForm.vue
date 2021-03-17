<template>
  <validation-observer
    v-slot="{ valid, validated, handleSubmit }"
    ref="observer"
  >
    <v-container class="m-auto d-flex flex-column form-container">
      <validation-provider
        v-slot="{ errors }"
        name="title"
        rules="required|max:100"
      >
        <v-text-field
          v-model="form.title"
          :error-messages="errors"
          flat
          label="Add A Title"
          data-vv-name="title"
          name="idea_title"
          class="idea-name-field"
          :single-line="true"
          :solo="true"
          @keyup.13="focusIdeaText"
        ></v-text-field>
      </validation-provider>

      <div class="idea-editor fill-height">
        <client-only>
          <idea-editor
            v-model="form.content"
            placeholder="Just start typing your idea here! You can add formatting with the toolbar below."
          >
            <template v-slot:menu-bar-after>
              <v-switch
                v-model="form.isPrivate"
                inset
                :label="form.isPrivate ? 'Private' : 'Public'"
                style="width: 105px; height: 33px;"
                class="ml-4 mr-1 mt-0 align-middle"
              ></v-switch>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <img
                    src="~assets/images/icons/info.svg"
                    alt=""
                    v-bind="attrs"
                    class="align-middle"
                    style="margin-top: -4px;"
                    v-on="on"
                  />
                </template>
                <span v-if="form.isPrivate"
                  >This idea can only by seen by you.<br />
                  To view it visit My Ideas.</span
                >
                <span v-else
                  >This idea will be posted to the idea feed,<br />
                  and can be viewed by others.</span
                >
              </v-tooltip>
              <v-btn
                rounded
                dark
                color="primary"
                :loading="loading"
                :disabled="!valid || !validated || uploadingAttachment"
                @click="handleSubmit(onSubmit)"
                >{{ buttonText }}</v-btn
              >
            </template>
          </idea-editor>
          <!--          <trix-wrapper-->
          <!--            v-model="form.content"-->
          <!--            class="editor"-->
          <!--            :class="{-->
          <!--              'fade-bottom': !atScrollEnd,-->
          <!--              'fade-top': !atScrollStart-->
          <!--            }"-->
          <!--            placeholder="Just start typing your idea here! You can add formatting with the toolbar below."-->
          <!--            :auto-delete-attachments="true"-->
          <!--            @attachmentsUploadStarted="onAttachmentsUploadStarted"-->
          <!--            @attachmentsUploadCompleted="onAttachmentsUploadCompleted"-->
          <!--            @fileAttached="onFileAttached"-->
          <!--            @fileRemoved="onFileRemoved"-->
          <!--            @ready="onTrixReady"-->
          <!--          />-->
        </client-only>
      </div>
    </v-container>
  </validation-observer>
</template>

<script>
import { mapGetters } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import merge from 'lodash/merge'
import IdeaEditor from '@/components/ideas/IdeaEditor'

export default {
  components: {
    IdeaEditor,
    ValidationObserver,
    ValidationProvider
  },

  props: {
    value: { type: Object, required: true },
    loading: Boolean,
    buttonText: { type: String, default: 'Post' }
  },

  data: () => ({
    form: {
      title: '',
      content: '',
      isPrivate: false,
      imageAttachments: [],
      fileAttachments: []
    },
    uploadingAttachment: false
  }),

  computed: {
    ...mapGetters({
      userSlug: 'userData/slug'
    })
  },

  watch: {
    form: {
      deep: true,
      handler(value) {
        this.$emit('input', value)
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.$refs.observer.validate()
    })

    this.form = merge({}, this.value)
  },

  methods: {
    onSubmit() {
      this.$emit('submit')
    },

    focusIdeaText() {
      // TODO
    },

    onAttachmentsUploadStarted() {
      this.uploadingAttachment = true
    },

    onAttachmentsUploadCompleted() {
      this.uploadingAttachment = false
    },

    onFileAttached({ type, key }) {
      if (type.substr(0, 5) === 'image') {
        this.form.imageAttachments.push(key)
      }
      this.form.fileAttachments.push(key)
    },

    onFileRemoved({ type, key }) {
      if (type.substr(0, 5) === 'image') {
        this.form.imageAttachments.splice(
          this.form.imageAttachments.indexOf(key),
          1
        )
      }
      this.form.fileAttachments.splice(
        this.form.fileAttachments.indexOf(key),
        1
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  position: relative;
  height: calc(100vh - 126px);
  max-width: 600px;
  overflow-y: hidden;

  @media (max-width: $screen-md-min) {
    height: calc(100vh - 100px);
  }
}

.submit-btn {
  position: absolute;
  bottom: -5px;
  right: 12px;

  @media (min-width: $screen-sm-min) {
    width: 14rem;
  }

  @media (max-width: $screen-xs-max) {
    bottom: -15px;
    left: 20px;
  }

  ::v-deep {
    .v-label {
      font-size: 0.9rem;
    }
  }
}

.idea-name-field {
  font-size: 24px;
  font-weight: 900;

  ::v-deep {
    input {
      padding: 0;
    }
    .v-input__slot {
      margin: 0 !important;
      padding: 0 !important;
      label {
        color: #c1b8c6;
        font-size: 24px;
      }
    }
    .v-label {
      height: 24px;
      line-height: 24px;
    }
    .v-text-field__details {
      padding-left: 0 !important;
    }
  }
}

::v-deep {
  .idea-editor {
    .editor {
      height: 100%;
      padding-bottom: 60px;

      @media (max-width: $screen-xs-max) {
        padding-bottom: 70px;
      }

      .trix-content {
        height: 100% !important;
        padding: 0;
        border: none;
        overflow-y: auto;

        &:active,
        &:focus {
          border: none;
        }
        &:empty::before {
          font-size: 18px;
          color: #c1b8c6;
          content: attr(placeholder);
          position: relative;
          top: -2px;
        }
        .attachment--preview {
          width: auto;
          max-width: calc(100% - 5px);
        }
      }
    }
  }

  .trix-button-row {
    position: absolute;
    bottom: 12px;
    left: 12px;

    @media (max-width: $screen-xs-max) {
      right: 12px;
      bottom: 2.5rem;
    }
  }
  .trix-button-group {
    margin: 0 0 5px 0 !important;
    flex-grow: 1;
    justify-content: space-between;
  }
  .trix-button {
    margin: 0 4px !important;
    @media (max-width: $screen-xs-max) {
      margin: 0 2px !important;
    }
  }

  .trix-button-group--file-tools {
    flex-grow: 0;
  }

  .trix-button-group-spacer {
    display: none;
  }

  .trix-button-group--history-tools {
    display: none;
  }

  #toggle-trix-panel {
    margin-bottom: 4px;
  }
}
</style>
