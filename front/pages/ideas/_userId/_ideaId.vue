<template>
  <layout>
    <v-row align="stretch">
      <v-col cols="12" md="8" class="idea-part">
        <div>
          <v-row class="idea-part__header" no-gutters>
            <v-col class="idea-part__header__title">
              <v-text-field
                v-if="editMode"
                v-model="ideaEditData.title"
                v-validate="'required|max:100'"
                label="Type your idea title"
                :error-messages="errors.collect('title')"
                data-vv-name="title"
                name="idea_title"
                class="idea-name-field"
                :single-line="true"
                :disabled="updatingIdea"
              ></v-text-field>
              <h2 v-else class="idea-part__header__title__label">
                {{ idea.title }}
              </h2>
            </v-col>
            <v-col v-if="!editMode" cols="auto" offset="1">
              <menu-panel
                :editable="isMyIdea"
                :idea="idea"
                @enableEditMode="enableEditMode"
                @savedStateChanged="onIdeaSaveStateChanged"
                @onNotification="onNotification"
                @onIdeaShared="onIdeaShared"
                @onDeleteIdea="onDeleteIdea"
                @onIdeaVisibilityChanged="onIdeaVisibilityChanged"
                @onIdeaVisibilityChangeError="onIdeaVisibilityChangeError"
              ></menu-panel>
            </v-col>
          </v-row>
          <div v-if="!editMode" class="idea-part__info">
            <v-row no-gutters>
              <v-col>
                <span class="muted">By</span>
                <span class="idea-part__info__author">
                  <router-link
                    class="idea-part__info__author__link muted"
                    :to="{
                      name: 'profile-userSlug',
                      params: {
                        userSlug: idea.authorSlug
                      }
                    }"
                    >{{ idea.authorName }}</router-link
                  >
                </span>
                <span class="idea-part__info__created-time">{{
                  idea.createdDate | toRelativeDate
                }}</span>
              </v-col>
            </v-row>
          </div>
          <!-- /idea-part__info -->

          <div class="idea-part__content">
            <div v-if="editMode" class="idea-part__content__idea-editor">
              <client-only>
                <trix-wrapper
                  v-model="ideaEditData.content"
                  class="editor"
                  placeholder="Type your idea text"
                  @attachmentsUploadStarted="onAttachmentsUploadStarted"
                  @attachmentsUploadCompleted="onAttachmentsUploadCompleted"
                  @fileAttached="onFileAttached"
                  @fileRemoved="onFileRemoved"
                />
              </client-only>
            </div>
            <div v-else>
              <idea-content :content="idea.content"></idea-content>
            </div>
          </div>
          <div class="idea-part__tags-panel">
            <div v-if="!editMode" class="tagsContainer">
              <v-chip
                v-for="(item, index) in ideaTags"
                :key="index"
                class="tag"
                text-color="white"
                color="secondary"
                >{{ item }}
              </v-chip>
            </div>
            <div v-else class="idea-part__tags-panel__tags-editor">
              <v-combobox
                v-model="ideaEditData.ideaTags"
                placeholder="Add tags here"
                :error-messages="errors.collect('tag')"
                data-vv-name="tag"
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
          <div v-if="editMode" class="idea-part__edit-buttons-panel">
            <v-btn text rounded @click="disableEditMode">Cancel</v-btn>
            <v-btn
              color="secondary"
              :loading="updatingIdea"
              rounded
              @click="saveIdeaContent"
              >Save
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <client-only>
          <idea-comments
            v-if="!editMode"
            :idea="idea"
            @onNotification="onNotification"
          ></idea-comments>
        </client-only>
      </v-col>
    </v-row>
    <visual-notifier ref="notifier"></visual-notifier>
    <register-encourage-dialog
      ref="registerEncourageDialog"
    ></register-encourage-dialog>
  </layout>
</template>

<script>
import clip from 'text-clipper'
import { graphqlOperation } from '@aws-amplify/api'
import Layout from '@/components/layout/Layout'
import TrixWrapper from '@/components/TrixWrapper'

import IdeaComments from '@/components/ideaDetail/IdeaComments'
import MenuPanel from '@/components/ideaDetail/MenuPanel'
import getUsersIdea from '~/graphql/query/getUsersIdea'
import getMyIdea from '~/graphql/query/getMyIdea'
import getIdeaTags from '~/graphql/query/getIdeaTags'
import updateIdea from '~/graphql/mutations/updateIdea'
import VisualNotifier from '~/components/VisualNotifier'
import deleteIdea from '~/graphql/mutations/deleteIdea'
import registerEncourageDialog from '~/components/dialogs/registerEncourageDialog'
import IdeaContent from '~/components/IdeaContent'

export default {
  components: {
    Layout,
    MenuPanel,
    IdeaComments,
    TrixWrapper,
    VisualNotifier,
    registerEncourageDialog,
    IdeaContent
  },
  $_veeValidate: {
    validator: 'new'
  },
  async asyncData({ app, route, store, error }) {
    const isMyIdea = store.getters['userData/userId'] === route.params.userId
    try {
      const { data } = await app.$amplifyApi.graphql({
        query: isMyIdea ? getMyIdea : getUsersIdea,
        variables: {
          userId: route.params.userId,
          ideaId: route.params.ideaId
        },
        authMode: isMyIdea ? undefined : 'API_KEY'
      })
      return {
        idea: data[isMyIdea ? 'getMyIdea' : 'getUsersIdea'],
        isMyIdea
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Idea not found' })
    }
  },
  data() {
    return {
      editMode: false,
      ideaTags: [],
      ideaEditData: {
        title: '',
        ideaTags: [],
        fileAttachments: [],
        imageAttachments: [],
        content: ''
      },

      updatingIdea: false
    }
  },
  mounted() {
    this.loadSecondaryData()
  },
  methods: {
    showRegisterEncourageDialog() {
      this.$refs.registerEncourageDialog.show()
    },
    onIdeaShared() {
      if (!this.$store.getters['cognito/isLoggedIn']) {
        setTimeout(() => {
          this.showRegisterEncourageDialog()
        }, 1000)
      }
    },
    onNotification({ type, message }) {
      this.$refs.notifier[type](message)
    },
    onIdeaSaveStateChanged({ liked, likesCount }) {
      this.idea.likesCount = likesCount
      this.$refs.notifier.success(liked ? 'Idea saved!' : 'Idea unsaved!')
    },
    copyIdeaDataForEdit() {
      this.ideaEditData.content = this.idea.content
      this.ideaEditData.ideaTags = this.ideaTags
        ? this.ideaTags.map(t => t)
        : []
      this.ideaEditData.imageAttachments = this.idea.imageAttachments
        ? this.idea.imageAttachments.map(t => t)
        : []
      this.ideaEditData.fileAttachments = this.idea.fileAttachments
        ? this.idea.fileAttachments.map(t => t)
        : []
      this.ideaEditData.title = this.idea.title
    },
    removeTag(item) {
      this.ideaEditData.ideaTags.splice(
        this.ideaEditData.ideaTags.indexOf(item),
        1
      )
    },
    enableEditMode() {
      this.copyIdeaDataForEdit()
      this.editMode = true
    },
    disableEditMode() {
      this.editMode = false
    },
    // Delete Idea
    async onDeleteIdea() {
      const confirmed = await this.$dialog.show({
        header: 'Delete Idea',
        message: 'Are you sure you want to delete this Idea?',
        buttonOkText: 'Delete',
        showCancelButton: true
      })
      if (!confirmed) {
        return
      }
      this.$store.commit('layoutState/showProgressBar')
      try {
        const ideaId = this.$route.params.ideaId
        await this.$amplifyApi.graphql(
          graphqlOperation(deleteIdea, {
            ideaId
          })
        )
        this.$refs.notifier.success('Idea deleted')
        this.$router.push('/ideas/me')
      } catch (err) {
        this.$refs.notifier.error('Something went wrong!!')
      }
      this.$store.commit('layoutState/hideProgressBar')
    },
    onIdeaVisibilityChanged({ isPrivate }) {
      this.idea.visibility = isPrivate ? 'PRIVATE' : 'PUBLIC'
      this.$refs.notifier.success(
        `Your Idea is ${isPrivate ? 'private' : 'public'} now!`
      )
    },
    onIdeaVisibilityChangeError({ isPrivate }) {
      this.$refs.notifier.error(`can't change Idea visibility!`)
    },
    async saveIdeaContent() {
      const result = await this.$validator.validateAll()
      if (!result) {
        return
      }
      this.updatingIdea = true
      setTimeout(async () => {
        try {
          await this.$amplifyApi.graphql(
            graphqlOperation(updateIdea, {
              ideaId: this.$route.params.ideaId,
              ideaOwnerId: this.$route.params.userId,
              content: this.ideaEditData.content,
              title: this.ideaEditData.title,
              tags: this.ideaEditData.ideaTags,
              imageAttachments: this.ideaEditData.imageAttachments,
              fileAttachments: this.ideaEditData.fileAttachments
            })
          )
          this.idea.content = this.ideaEditData.content
          this.idea.title = this.ideaEditData.title
          this.idea.fileAttachments = this.ideaEditData.fileAttachments
          this.idea.imageAttachments = this.ideaEditData.imageAttachments
          this.ideaTags = this.ideaEditData.ideaTags
          this.editMode = false
          this.updatingIdea = false
          this.$refs.notifier.success('Idea Updated!')
        } catch (e) {
          this.updatingIdea = false
          this.$refs.notifier.error("Can't update Idea!")
        }
      }, 10) // if last tag not saved yet editor needs time to process outer click event
    },
    async loadIdeaTags() {
      const ideaTags = []
      if (this.$store.getters['cognito/isLoggedIn']) {
        const tag = await this.$amplifyApi.graphql({
          query: getIdeaTags,
          variables: {
            ideaId: this.$route.params.ideaId
          }
        })

        for (let i = 0; i < tag.data.ideaTags.length; i++) {
          ideaTags.push(tag.data.ideaTags[i].tag)
        }
      }
      this.ideaTags = ideaTags
    },
    loadSecondaryData() {
      this.loadIdeaTags()
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
    }
  },
  head() {
    const defaultLogo = require('~/assets/images/bulb_with_light_holder.png')
    const truncatedIdeaContent = clip(this.idea.content, 180, {
      html: true,
      maxLines: 8,
      indicator: '... (see more)'
    })
    const ogDescription = truncatedIdeaContent.replace(/<\/?[^>]+(>|$)/g, '')
    return {
      title: `${this.idea.title} - Daily Idea`,
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.idea.title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: ogDescription
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.idea.previewImage
            ? `https://${process.env.USER_UPLOADS_S3_DOMAIN}.s3.amazonaws.com/${this.idea.previewImage}`
            : defaultLogo
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/common';
.idea-name-field {
  font-size: 24px;
}

.idea-part {
  @media (min-width: $screen-md-min) {
    min-height: calc(100vh - 88px);
  }
  min-height: 200px;
  position: relative;

  &__info {
    &__author {
      &__link {
        text-transform: capitalize;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }

    &__created-time {
      color: rgb(255, 185, 45);
    }
  }

  &__content {
    word-break: break-word;
    margin-top: 1rem;
    @media (min-width: $screen-md-min) {
      min-height: 300px;
    }
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
    }
  }

  &__tags-panel {
    /*border-top: 1px solid #ebe7ed;*/
    /*padding-left: 10px;*/

    .tagsContainer {
      margin-top: 20px;

      .tag {
        margin: 4px;
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
