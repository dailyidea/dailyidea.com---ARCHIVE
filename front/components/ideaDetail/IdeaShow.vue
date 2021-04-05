<template>
  <div class="idea-container fill-height fill-width">
    <div class="d-flex flex-column fill-height">
      <div>
        <h2 class="card-title">
          {{ idea.title }}
        </h2>
        <div class="pt-2 pb-2">
          <span class="d-inline-block align-middle">
            <router-link
              class="author-link d-flex align-center"
              :to="`/profile/${idea.authorSlug}`"
            >
              <img class="author-avatar" :src="idea.authorAvatar" />
              <span class="ml-2">{{ idea.authorName }}</span>
            </router-link>
          </span>
          <span class="d-inline-block align-middle muted ml-2">{{
            idea.createdDate | toRelativeDate
          }}</span>
          <span
            v-if="idea.visibility === 'PRIVATE'"
            class="d-inline-block ml-2 private-label"
          >
            <img
              src="~assets/images/icons/private.svg"
              class="align-middle"
              alt="Private"
            />
            private
          </span>
        </div>
        <v-row cols="auto" offset="1">
          <menu-panel
            :editable="idea.userId === userId"
            :preview="preview"
            :idea="idea"
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
      <div class="mt-4 overflow-hidden d-flex flex-column flex-grow-1">
        <idea-content
          :collapsed="!expanded"
          :content="ideaContent"
          :preview="preview"
          @click.native="$emit('expand')"
        ></idea-content>
      </div>
      <div>
        <div v-if="!preview && ideaTags.length" class="tags-panel">
          <div class="tagsContainer">
            <v-chip v-for="(item, index) in ideaTags" :key="index" class="tag"
              >{{ item }}
            </v-chip>
          </div>
        </div>

        <a
          v-if="!expanded"
          role="button"
          class="cursor-pointer d-inline-block flex-1"
          @click.stop="$emit('expand')"
        >
          <span class="link-highlight">Read All</span>
        </a>

        <a
          v-if="expanded && !preview"
          role="button"
          class="d-inline-block muted view-all-comments-text"
          @click="$emit('open-comments')"
        >
          View all {{ idea.commentsCount || '' }} comments
        </a>
      </div>
    </div>
    <auth-flow v-model="showAuth" action="share" @cancel="showAuth = false" />
  </div>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import { mapGetters } from 'vuex'
import MenuPanel from '@/components/ideaDetail/MenuPanel'
import deleteIdea from '@/graphql/mutations/deleteIdea'
import IdeaContent from '@/components/ideaDetail/IdeaContent'
import AuthFlow from '@/components/auth/AuthFlow'

export default {
  components: {
    AuthFlow,
    MenuPanel,
    IdeaContent
  },

  props: {
    idea: { type: Object, required: true },
    ideaTags: { type: Array, default: () => [] },
    preview: Boolean,
    expanded: Boolean
  },

  data: () => ({
    showAuth: false
  }),

  computed: {
    ...mapGetters({ userId: 'userData/userId' }),

    ideaContent() {
      if (this.isMobile && this.preview) {
        return ''
      }

      const content = this.idea.content || this.idea.strippedContent || ''
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
          this.showAuth = true
        }, 1000)
      }
    },

    onIdeaSaveStateChanged({ saved, savesCount }) {
      this.$emit('updated', { ...this.idea, savesCount })
      this.$emit(saved ? 'saved' : 'unsaved')
      this.$notifier.show({
        color: 'green',
        message: saved ? 'Idea Saved!' : 'Idea Unsaved!',
        iconName: saved ? 'bookmarked' : 'unbookmarked'
      })
    },

    onIdeaLikeStateChanged({ liked, likesCount }) {
      this.$emit('updated', { ...this.idea, likesCount })
      this.$emit(liked ? 'liked' : 'unliked')

      this.$notifier.show({
        color: 'green',
        message: liked ? 'Idea Liked!' : 'Idea Unliked',
        iconName: liked ? 'like' : 'unlike'
      })
    },

    onIdeaVisibilityChangeError({ isPrivate }) {
      this.$notifier.error(`can't change Idea visibility!`)
    },

    async onDeleteIdea() {
      const confirmed = await this.$dialog.show({
        header: 'Delete Idea?',
        subheader:
          'Are you sure you want to delete this idea, this action cannot be undone.',
        imagePath: require('~/assets/images/dialogs/dialog_delete.svg'),
        buttonOkText: 'Delete',
        showCancelButton: true,
        maxImageWidth: 260
      })
      if (!confirmed) {
        return
      }
      this.$store.commit('layoutState/showProgressBar')
      try {
        const ideaId = this.idea.ideaId
        await this.$amplifyApi.graphql(graphqlOperation(deleteIdea, { ideaId }))
        this.$notifier.success('Idea deleted')
        // this.$router.push('/ideas/me')
        this.$emit('deleted', ideaId)
      } catch (err) {
        this.$notifier.error('Something went wrong!!')
      }
      this.$store.commit('layoutState/hideProgressBar')
    },

    onIdeaVisibilityChanged({ isPrivate }) {
      this.$emit('updated', {
        ideaId: this.idea.ideaId,
        visibility: isPrivate ? 'PRIVATE' : 'PUBLIC'
      })
      this.$notifier.show({
        color: 'green',
        message: `Your Idea is ${isPrivate ? 'private' : 'public'} now!`,
        iconName: isPrivate ? 'private' : 'public'
      })
    },

    commentsBtnClick() {
      this.$emit('comments-btn-clicked')
      setTimeout(() => {
        this.$refs.ideaComments &&
          this.$refs.ideaComments.$refs.commentInput.focus()
      }, 100)
    }
  }
}
</script>

<style scoped lang="scss">
.card-title {
  text-transform: capitalize;
  font-weight: 100;
}

.author-avatar {
  width: 24px;
  margin-bottom: 5px;
  border-radius: 100%;
}

.author-link {
  text-transform: capitalize;
  text-decoration: none;
  color: $disabled-purple;
  &:hover {
    text-decoration: underline;
  }
}

.tags-panel {
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

.idea-container {
  position: relative;
  max-width: 669px;
  height: 100%;

  @media (min-width: $screen-md-min) {
    padding: 8px 16px;
  }
}

.private-label {
  margin-top: -2px;
  padding: 1px 5px;
  border: 1px solid $primary-color;
  border-radius: 20px;
  vertical-align: middle;
  color: $primary-color;
  font-size: 0.75rem;
}
</style>
