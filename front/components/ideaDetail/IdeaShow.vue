<template>
  <v-row>
    <v-col cols="12" :md="preview ? '' : 8" class="idea-part">
      <div>
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
            <span class="muted ml-2 idea-date">{{
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
            @on-notification="onNotification"
            @on-idea-shared="onIdeaShared"
            @on-delete-idea="onDeleteIdea"
            @on-idea-visibility-changed="onIdeaVisibilityChanged"
            @on-idea-visibility-change-error="onIdeaVisibilityChangeError"
            @comments-btn-click="commentsBtnClick"
            @click.native.stop
          ></menu-panel>
        </v-row>
      </div>
      <div class="idea-part__content-container">
        <div class="idea-part__content">
          <div class="idea-part__idea-content hide-scrollbar fade-bottom">
            <idea-content
              :collapsed="!expanded"
              :content="ideaContent"
            ></idea-content>
            <div
              v-if="preview"
              class="text-center cursor-pointer"
              @click.stop="$emit('view-preview', idea)"
            >
              <span class="link-highlight">View Idea</span>
            </div>
          </div>
        </div>
        <div v-if="!preview" class="idea-part__tags-panel">
          <div class="tagsContainer">
            <v-chip v-for="(item, index) in ideaTags" :key="index" class="tag"
              >{{ item }}
            </v-chip>
          </div>
        </div>
      </div>
    </v-col>
    <v-col v-if="!preview" cols="12" md="4" class="comments-section">
      <idea-comments
        v-if="expanded"
        ref="ideaComments"
        :idea="idea"
        @onNotification="onNotification"
        @click.native.stop
      ></idea-comments>
      <span v-else-if="!expanded" class="muted d-flex flex-column justify-end"
        >View all {{ idea.commentsCount || 0 }} comments</span
      >
    </v-col>
    <register-encourage-dialog v-model="showRegisterEncourageDialog" />
    <visual-notifier ref="notifier"></visual-notifier>
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
import VisualNotifier from '@/components/VisualNotifier'

export default {
  components: {
    RegisterEncourageDialog,
    IdeaComments,
    MenuPanel,
    IdeaContent,
    VisualNotifier
  },

  props: {
    idea: { type: Object, required: true },
    ideaTags: { type: Array, default: () => [] },
    preview: { type: Boolean, default: false },
    expanded: { type: Boolean, default: false }
  },

  data: () => ({
    showRegisterEncourageDialog: false
  }),

  computed: {
    ...mapGetters({
      userId: 'userData/userId'
    }),

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

      return content
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

    onNotification({ type, message }) {
      this.$refs.notifier[type](message)
    },

    onIdeaSaveStateChanged({ saved }) {
      this.$refs.notifier.success(saved ? 'Idea Saved!' : 'Idea Unsaved!')
    },

    onIdeaLikeStateChanged({ liked, likesCount }) {
      this.idea.likesCount = likesCount
      this.$refs.notifier.success(liked ? 'Idea Liked!' : 'Idea Unliked')
    },

    onIdeaVisibilityChangeError({ isPrivate }) {
      this.$refs.notifier.error(`can't change Idea visibility!`)
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
        this.$refs.notifier.success('Idea deleted')
        this.$router.push('/ideas/me')
      } catch (err) {
        this.$refs.notifier.error('Something went wrong!!')
      }
      this.$store.commit('layoutState/hideProgressBar')
    },

    onIdeaVisibilityChanged({ isPrivate }) {
      this.$emit('updated', { visibility: isPrivate ? 'PRIVATE' : 'PUBLIC' })
      this.$refs.notifier.success(
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
.comments-section {
  display: flex;
  align-items: flex-end;
}

.idea-date {
  margin-top: 2px;
}

.idea-part {
  position: relative;

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

  &__idea-content {
    @media only screen and (min-width: $screen-md-min) {
      overflow-y: auto;
    }
  }

  &__content-container {
    word-break: break-word;
    margin-top: 1rem;
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
