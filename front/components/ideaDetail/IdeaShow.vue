<template>
  <v-row class="container-row">
    <v-col cols="12" :md="preview ? '' : 8" class="idea-part">
      <div class="d-flex flex-column fill-height">
        <div class="idea-part__top">
          <v-row class="idea-part__header" no-gutters>
            <v-col class="idea-part__header__title">
              <h2 class="idea-part__header__title__label">
                {{ idea.title }}
              </h2>
            </v-col>
          </v-row>
          <div class="idea-part__info pt-2 pb-2">
            <v-row no-gutters>
              <span class="idea-part__info__author">
                <router-link
                  class="idea-part__info__author__link d-flex align-center"
                  :to="{
                    name: 'profile-userSlug',
                    params: { userSlug: idea.authorSlug }
                  }"
                >
                  <img
                    class="idea-part__author-avatar"
                    :src="idea.authorAvatar"
                  />
                  <span class="ml-2">{{ idea.authorName }}</span>
                </router-link>
              </span>
              <span class="muted ml-2">{{
                idea.createdDate | toRelativeDate
              }}</span>
            </v-row>
          </div>
          <v-row cols="auto" offset="1">
            <menu-panel
              :editable="idea.userId === userId"
              :preview="preview"
              :idea="idea"
              @enable-edit-mode="$emit('edit')"
              @saved-state-changed="onIdeaSaveStateChanged"
              @liked-state-changed="onIdeaLikeStateChanged"
              @on-idea-shared="onIdeaShared"
              @on-delete-idea="onDeleteIdea"
              @on-idea-visibility-changed="onIdeaVisibilityChanged"
              @on-idea-visibility-change-error="onIdeaVisibilityChangeError"
              @comments-btn-click="commentsBtnClick"
              @click.native.stop
            ></menu-panel>
          </v-row>
        </div>
        <div class="mt-4 overflow-hidden d-flex flex-column">
          <idea-content
            :collapsed="!expanded"
            :content="ideaContent"
            :preview="preview"
          ></idea-content>
        </div>
        <div>
          <div v-if="!preview" class="idea-part__tags-panel">
            <div class="tagsContainer">
              <v-chip v-for="(item, index) in ideaTags" :key="index" class="tag"
                >{{ item }}
              </v-chip>
            </div>
          </div>

          <div
            v-if="preview"
            class="text-center cursor-pointer flex-1"
            @click.stop="$emit('view-preview', idea)"
          >
            <span class="link-highlight">View Idea</span>
          </div>

          <div v-if="!expanded" class="muted view-all-comments-text">
            View all {{ idea.commentsCount || 0 }} comments
          </div>
        </div>
      </div>
    </v-col>
    <v-col v-if="!preview && expanded" cols="12" md="4" class="fill-height">
      <idea-comments
        ref="ideaComments"
        :idea="idea"
        @click.native.stop
      ></idea-comments>
    </v-col>
    <register-encourage-dialog v-model="showRegisterEncourageDialog" />
  </v-row>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import { mapGetters } from 'vuex'
import IdeaComments from '@/components/ideaDetail/IdeaComments'
import MenuPanel from '@/components/ideaDetail/MenuPanel'
import deleteIdea from '@/graphql/mutations/deleteIdea'
import IdeaContent from '@/components/IdeaContent'
import RegisterEncourageDialog from '@/components/dialogs/RegisterEncourageDialog'

export default {
  components: {
    RegisterEncourageDialog,
    IdeaComments,
    MenuPanel,
    IdeaContent
  },

  props: {
    idea: { type: Object, required: true },
    ideaTags: { type: Array, default: () => [] },
    preview: { type: Boolean, default: false },
    expanded: { type: Boolean, default: false }
  },

  data: () => ({ showRegisterEncourageDialog: false }),

  computed: {
    ...mapGetters({ userId: 'userData/userId' }),

    ideaContent() {
      if (this.isMobile && this.preview) {
        return ''
      }

      const content = this.idea.content || this.idea.strippedContent
      if (this.preview && content) {
        if (content.length > 255) {
          return `${content.substring(0, 255)}...`
        }
      }

      return `${content}<br><br>`
    }
  },

  mounted() {
    if (this.$route.query.comment) {
      setTimeout(() => this.commentsBtnClick(), 500)
    }
  },

  methods: {
    onIdeaShared() {
      if (!this.$store.getters['cognito/isLoggedIn']) {
        setTimeout(() => {
          this.showRegisterEncourageDialog = true
        }, 1000)
      }
    },

    onIdeaSaveStateChanged({ saved }) {
      this.$notifier.success(saved ? 'Idea Saved!' : 'Idea Unsaved!')
    },

    onIdeaLikeStateChanged({ liked, likesCount }) {
      this.idea.likesCount = likesCount
      this.$notifier.success(liked ? 'Idea Liked!' : 'Idea Unliked')
    },

    onIdeaVisibilityChangeError({ isPrivate }) {
      this.$notifier.error(`can't change Idea visibility!`)
    },

    async onDeleteIdea() {
      const confirmed = await this.$dialog.show({
        header: 'Delete Idea',
        message: 'Are you sure you want to delete this Idea?',
        imagePath: require('~/assets/images/dialogs/undraw_throw_away_ldjd.svg'),
        buttonOkText: 'Delete',
        showCancelButton: true
      })
      if (!confirmed) {
        return
      }
      this.$store.commit('layoutState/showProgressBar')
      try {
        const ideaId = this.idea.ideaId
        await this.$amplifyApi.graphql(graphqlOperation(deleteIdea, { ideaId }))
        this.$notifier.success('Idea deleted')
        this.$router.push('/ideas/me')
      } catch (err) {
        this.$notifier.error('Something went wrong!!')
      }
      this.$store.commit('layoutState/hideProgressBar')
    },

    onIdeaVisibilityChanged({ isPrivate }) {
      this.$emit('updated', { visibility: isPrivate ? 'PRIVATE' : 'PUBLIC' })
      this.$notifier.success(
        `Your Idea is ${isPrivate ? 'private' : 'public'} now!`
      )
    },

    commentsBtnClick() {
      this.$emit('expand')
      setTimeout(() => {
        this.$refs.ideaComments &&
          this.$refs.ideaComments.$refs.commentInput.focus()
      }, 100)
    }
  }
}
</script>

<style scoped lang="scss">
.container-row {
  height: 100%;
}

.idea-part {
  position: relative;
  height: 100%;

  @media (min-width: $screen-md-min) {
    padding: 8px 16px;
  }

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

  &__header {
    &__title {
      text-transform: capitalize;
      &__label {
        font-weight: 100;
      }
    }
  }

  &__tags-panel {
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
  }
}
</style>
