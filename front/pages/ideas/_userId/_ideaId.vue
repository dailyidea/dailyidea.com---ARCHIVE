<template>
  <layout>
    <v-row no-gutters align="stretch">
      <v-col cols="12" md="8" class="idea-part">
        <div>
          <div class="idea-part__header">
            <menu-panel
              :editable="isMyIdea"
              :is-private="idea.visibility === 'PRIVATE'"
              @enableEditMode="enableEditMode"
              @savedStateChanged="onIdeaSaveStateChanged"
              @onNotification="onNotification"
              @onDeleteIdea="onDeleteIdea"
            ></menu-panel>
            <div class="idea-part__header__title">
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
              <span v-else class="idea-part__header__title__label">{{
                idea.title
              }}</span>
            </div>
          </div>
          <div class="idea-part__info">
            <v-row no-gutters>
              <v-col>
                <span class="idea-part__info__author">
                  <span v-if="isMyIdea">My Idea</span>
                  <span v-else>
                    <router-link
                      class="idea-part__info__author__link"
                      :to="{
                        name: 'ideas-userSlug',
                        params: {
                          userSlug: idea.authorSlug
                        }
                      }"
                      >{{ idea.authorName }}</router-link
                    >'s Idea
                  </span>
                </span>
              </v-col>
              <v-col style="text-align: right">
                <span class="idea-part__info__created-time">{{
                  idea.createdDate | toRelativeDate
                }}</span>
              </v-col>
            </v-row>
          </div>
          <div class="idea-part__content">
            <div v-if="editMode" class="idea-part__content__idea-editor">
              <client-only>
                <trix-wrapper
                  v-model="ideaEditData.content"
                  class="editor"
                  placeholder="Type your idea text"
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
                label
                class="tag"
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
                label=""
                multiple
                :disabled="updatingIdea"
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    label
                    light
                    text-color="#fff"
                    style="font-weight: normal"
                    color="#C0B7C5"
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
            <v-btn
              color="primary"
              :loading="updatingIdea"
              @click="saveIdeaContent"
              >Save
            </v-btn>
            <v-btn text color="error" @click="disableEditMode">Cancel</v-btn>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <idea-comments
          :idea="idea"
          :comments-deletable="isMyIdea"
          @onNotification="onNotification"
        ></idea-comments>
      </v-col>
    </v-row>
    <visual-notifier ref="notifier"></visual-notifier>
    <simple-dialog-popup ref="simpleDialogPopup"></simple-dialog-popup>
  </layout>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import Layout from '@/components/layout/Layout'
import TrixWrapper from '@/components/TrixWrapper'

import IdeaComments from '@/components/ideaDetail/IdeaComments'
import MenuPanel from '@/components/ideaDetail/MenuPanel'
import getUsersIdea from '~/graphql/query/getUsersIdea'
import getIdeaTags from '~/graphql/query/getIdeaTags'
import updateIdea from '~/graphql/mutations/updateIdea'
import VisualNotifier from '~/components/VisualNotifier'
import deleteIdea from '~/graphql/mutations/deleteIdea'
import simpleDialogPopup from '~/components/dialogs/simpleDialogPopup'
import IdeaContent from '~/components/IdeaContent'

export default {
  components: {
    Layout,
    MenuPanel,
    IdeaComments,
    TrixWrapper,
    VisualNotifier,
    simpleDialogPopup,
    IdeaContent
  },
  $_veeValidate: {
    validator: 'new'
  },
  async asyncData({ app, route, store }) {
    const isMyIdea = store.getters['userData/userId'] === route.params.userId
    const { data } = await app.$amplifyApi.graphql({
      query: getUsersIdea,
      variables: {
        userId: route.params.userId,
        ideaId: route.params.ideaId
      },
      authMode: 'API_KEY'
    })
    return {
      idea: data.getUsersIdea,
      isMyIdea
    }
  },
  data() {
    return {
      editMode: false,
      ideaTags: [],
      ideaEditData: {
        title: '',
        ideaTags: [],
        content: ''
      },

      updatingIdea: false
    }
  },
  mounted() {
    this.loadSecondaryData()
  },
  methods: {
    onNotification({ type, message }) {
      this.$refs.notifier[type](message)
    },
    onIdeaSaveStateChanged({ liked, likesCount }) {
      this.idea.likesCount = likesCount
      this.$refs.notifier.success(liked ? 'Liked' : 'Unliked')
    },
    toggleIdeaPrivacy() {},
    copyIdeaDataForEdit() {
      this.ideaEditData.content = this.idea.content
      this.ideaEditData.ideaTags = this.ideaTags.map(t => t)
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
      const confirmed = await this.$refs.simpleDialogPopup.show(
        'Delete Idea',
        'Are you sure you want to delete this Idea?',
        'Delete'
      )
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
              tags: this.ideaEditData.ideaTags
            })
          )
          this.idea.content = this.ideaEditData.content
          this.idea.title = this.ideaEditData.title
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
    }
  }
}
</script>

<style lang="scss" scoped>
.idea-name-field {
  font-size: 24px;
}

.idea-part {
  /*background-color: tan;*/
  @media (min-width: $screen-md-min) {
    min-height: calc(100vh - 88px);
  }
  min-height: 200px;
  position: relative;

  &__info {
    /*margin-top: 10px;*/
    /*padding: 0 5px;*/
    color: #c0b7c5;
    @media (min-width: $screen-sm-min) {
      margin: 30px 0;
    }
    &__author {
      &__link {
        color: #857f88 !important;
      }
    }

    &__created-time {
      margin-right: 5px;
    }
  }

  &__content {
    color: #827c85;
    line-height: 1.7;
    letter-spacing: 0.5px;
    word-break: break-word;
    margin-top: 10px;
    @media (min-width: $screen-md-min) {
      min-height: 300px;
      padding-right: 5px;
    }
    &__idea-editor {
      ::v-deep .trix-content {
        height: 240px;
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
    $base-height: 50px;
    min-height: $base-height;
    font-size: 0;

    &__title {
      &__label {
        margin-top: 10px;
        display: inline-block;
        font-size: 24px;
        color: #18141c;
      }

      @media (max-width: $screen-xs-max) {
        padding-top: 14px;
        font-size: 20px;
      }
      @media (min-width: $screen-sm-min) {
        display: inline-block;
        width: calc(100% - 200px);
      }

      min-height: 50px;
      /*background-color: #b98dd2;*/
      vertical-align: top;
    }
  }

  &__tags-panel {
    /*border-top: 1px solid #ebe7ed;*/
    /*padding-left: 10px;*/
    padding-right: 5px;

    .tagsContainer {
      margin-top: 20px;

      .tag {
        margin: 0px 2px 10px 2px;
        border-radius: 6px;
        background-color: rgb(192, 183, 197);
        color: white;
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
