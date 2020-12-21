<template>
  <Layout>
    <validation-observer v-slot="{ valid, validated, handleSubmit }">
      <v-container class="m-auto d-flex flex-column form-container">
        <validation-provider
          v-slot="{ errors }"
          name="title"
          rules="required|max:100"
        >
          <v-text-field
            v-model="title"
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

        <div class="idea-editor flex-grow-1 fill-height">
          <client-only>
            <trix-wrapper
              v-model="contents"
              class="editor"
              :class="{
                'fade-bottom': !atScrollEnd,
                'fade-top': !atScrollStart
              }"
              placeholder="Just start typing your idea here! You can add formatting with the toolbar below."
              :auto-delete-attachments="true"
              @attachmentsUploadStarted="onAttachmentsUploadStarted"
              @attachmentsUploadCompleted="onAttachmentsUploadCompleted"
              @fileAttached="onFileAttached"
              @fileRemoved="onFileRemoved"
              @ready="onTrixReady"
            />
          </client-only>
        </div>

        <div class="submit-btn d-flex align-center">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" class="mr-3" v-on="on">
                <v-switch
                  v-model="isPrivate"
                  inset
                  :label="isPrivate ? 'Private' : 'Public'"
                ></v-switch>
              </div>
            </template>
            <span v-if="isPrivate"
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
            :loading="creatingIdea"
            :disabled="!valid || !validated"
            @click="handleSubmit(onCreateIdea)"
            >Post</v-btn
          >
        </div>
      </v-container>
    </validation-observer>
  </Layout>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { graphqlOperation } from '@aws-amplify/api'
import TrixWrapper from '@/components/TrixWrapper'
import Layout from '@/components/layout/Layout'
import createIdea from '~/graphql/mutations/createIdea'

export default {
  components: {
    Layout,
    TrixWrapper,
    ValidationObserver,
    ValidationProvider
  },

  middleware: 'authenticated',

  data: () => ({
    contents: '',
    title: '',
    isPrivate: false,
    imageAttachments: [],
    fileAttachments: [],
    creatingIdea: false,
    uploadingAttachment: false,
    atScrollEnd: true,
    atScrollStart: true,
    scrollContainer: null
  }),

  computed: {
    ...mapGetters({
      userSlug: 'userData/slug'
    }),

    allowCreateIdea() {
      return this.title && !this.uploadingAttachment
    }
  },

  watch: {
    contents() {
      this.checkScroll()
    }
  },

  beforeDestroy() {
    if (this.scrollContainer) {
      this.scrollContainer.removeEventListener('scroll')
    }
  },

  methods: {
    ...mapMutations({
      updateCreatedIdea: 'ideas/UPDATE_CREATED'
    }),

    onTrixReady() {
      this.scrollContainer = document.querySelector('.trix-content')
      this.checkScroll()
      this.scrollContainer.addEventListener('scroll', this.checkScroll)
    },

    focusIdeaText() {
      document.querySelector('trix-editor').focus()
    },

    onAttachmentsUploadStarted() {
      this.uploadingAttachment = true
    },

    onAttachmentsUploadCompleted() {
      this.uploadingAttachment = false
    },

    onFileAttached({ type, key }) {
      if (type.substr(0, 5) === 'image') {
        this.imageAttachments.push(key)
      }
      this.fileAttachments.push(key)
    },

    onFileRemoved({ type, key }) {
      if (type.substr(0, 5) === 'image') {
        this.imageAttachments.splice(this.imageAttachments.indexOf(key), 1)
      }
      this.fileAttachments.splice(this.fileAttachments.indexOf(key), 1)
    },

    async onCreateIdea() {
      this.creatingIdea = true

      try {
        const result = await this.$amplifyApi.graphql(
          graphqlOperation(createIdea, {
            content: this.contents,
            title: this.title,
            tags: [],
            fileAttachments: this.fileAttachments,
            imageAttachments: this.imageAttachments,
            isPrivate: this.isPrivate
          })
        )

        this.creatingIdea = false
        this.$notifier.success('Idea Created')

        // Redirect to idea deail page
        const { shortId, slug, ideaId } = result.data.createIdea
        this.updateCreatedIdea(ideaId)

        if (this.isPrivate) {
          this.$router.push(`/profile/${this.userSlug}`)
        } else {
          this.$router.push({
            name: 'i-shortId-slug',
            params: { shortId, slug },
            force: true
          })
        }
      } catch (err) {
        this.$notifier.error('Something went wrong!')
        this.creatingIdea = false
      }
    },

    checkScroll() {
      if (!this.scrollContainer) {
        return
      }
      const $el = this.scrollContainer
      const currentScrollLocation = $el.scrollTop
      const scrollMax = $el.scrollHeight - $el.clientHeight

      this.atScrollEnd = currentScrollLocation >= scrollMax - 5
      this.atScrollStart = currentScrollLocation === 0
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
  width: 13rem;
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
    .fade-top .trix-content {
      mask-image: linear-gradient(to top, black 90%, transparent 100%);
    }
    .fade-bottom .trix-content {
      mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
    }
    .fade-top.fade-bottom .trix-content {
      mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        black 10%,
        black 90%,
        transparent 100%
      );
    }
  }

  .trix-button-row {
    position: absolute;
    bottom: 12px;
    left: 12px;

    @media (max-width: $screen-xs-max) {
      bottom: 0;
      display: flex;
      flex-wrap: wrap;
      width: 200px;
      justify-content: flex-start;
    }
  }
  .trix-button-group {
    margin: 0 0 5px 0 !important;
  }
  .trix-button {
    margin: 0 5px !important;
    @media (max-width: $screen-xs-max) {
      margin: 0 !important;
    }
  }

  #toggle-trix-panel {
    margin-bottom: 4px;
  }
}
</style>
