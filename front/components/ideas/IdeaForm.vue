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

      <div class="idea-editor fill-height" style="height: calc(100% - 70px);">
        <client-only>
          <idea-editor
            v-model="form.content"
            :image-attachments.sync="form.imageAttachments"
            :file-attachments.sync="form.fileAttachments"
            :content-style="{
              height: $vuetify.breakpoint.xsOnly
                ? 'calc(100% - 72px)'
                : 'calc(100% - 50px)'
            }"
            placeholder="Just start typing your idea here! You can add formatting with the toolbar below."
          >
            <template v-slot:menu-bar-after>
              <div class="d-flex private-switch">
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
              </div>
              <v-btn
                rounded
                dark
                color="primary"
                class="submit-btn"
                :loading="loading"
                :disabled="!valid || !validated || uploadingAttachment"
                @click="handleSubmit(onSubmit)"
                >{{ buttonText }}</v-btn
              >
            </template>
          </idea-editor>
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

.submit-btn,
.private-switch {
  @media (max-width: $screen-xs-max) {
    width: 50%;
    margin-top: 10px;
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
    }
  }
}
</style>
