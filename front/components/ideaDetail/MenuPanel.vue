<template>
  <div class="menu-panel-container" @click.stop>
    <share-idea-by-email-dialog
      v-model="showEmailShareDialog"
      :idea="idea"
      @success="onSharedIdeaOverEmail"
      @error="onSharedIdeaOverEmailError"
      @onCopyShareLink="onCopyShareLink"
    ></share-idea-by-email-dialog>

    <default-dialog
      v-model="showMakeIdeaPrivate"
      header="Want To Make Your Idea Private?"
      button-ok-text="Make Private"
      :image-path="require('~/assets/images/dialogs/undraw_security_o890.svg')"
      @ok="makeIdeaPrivate"
    >
      <p>That's ok!</p>
      <p>
        Some things aren't ready to be shared. Make this idea private with just
        one click.
      </p>
    </default-dialog>

    <default-dialog
      v-model="showMakeIdeaPublic"
      header="Share Your Idea With The World!"
      button-ok-text="Make Public"
      :image-path="
        require('~/assets/images/dialogs/undraw_spread_love_r9jb.svg')
      "
      @ok="makeIdeaPublic"
    >
      <p>
        Awesome!
      </p>
      <p>Ideas want to be shared! Make this idea public with just one click.</p>
    </default-dialog>

    <v-menu
      v-if="editable"
      transition="slide-y-transition"
      nudge-bottom="10"
      min-width="400"
      max-width="400"
      left
      offset-y
    >
      <template v-slot:activator="{ on, value }">
        <v-icon
          :class="{ 'menu-button-selected': value }"
          class="menu-button moreActionsButton"
          v-on="on"
          >fas fa-ellipsis-v</v-icon
        >
      </template>
      <div class="text-center mt-5 bold">
        Post Settings
      </div>
      <v-list>
        <v-list-item @click="enableEditMode">
          <v-list-item-title>
            <pencil-icon fill="none" :stroke="iconColor"></pencil-icon>
            <span class="item-text ml-7">Edit Idea</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="deleteIdea">
          <v-list-item-title>
            <trash-icon :stroke="iconColor"></trash-icon>
            <span class="item-text ml-6">Delete Idea</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-show="editable" @click="toggleIdeaPrivacy">
          <v-list-item-title>
            <span v-if="!isPrivate" class="d-flex align-center">
              <locked-icon :stroke="iconColor"></locked-icon>
              <span class="item-text ml-5">Make Private</span>
            </span>
            <span v-else class="d-flex align-center">
              <unlocked-icon :stroke="iconColor"></unlocked-icon>
              <span class="item-text ml-5">Make Public</span>
            </span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <div class="idea-part__header__buttons-panel">
      <div class="actions-row d-flex align-center justify-space-around">
        <act-on-idea
          :idea="idea"
          action="like"
          @liked-state-changed="onIdeaLikeStateChanged"
        ></act-on-idea>
        <act-on-idea
          :idea="idea"
          action="save"
          @saved-state-changed="onIdeaSaveStateChanged"
        ></act-on-idea>
        <v-btn x-small icon text class="img-count" @click="commentClicked">
          <img src="~/assets/images/idea-card/comment.png" />
          <span class="count">{{ idea.commentsCount }}</span>
        </v-btn>

        <v-tooltip v-if="idea.visibility === 'PRIVATE'" top>
          <template v-slot:activator="{ on, attrs }">
            <img
              v-bind="attrs"
              src="~assets/images/idea-card/share-disabled.svg"
              alt="Share disabeld"
              v-on="on"
            />
          </template>
          <span>Private ideas can't be shared</span>
        </v-tooltip>
        <v-btn
          v-else
          x-small
          icon
          text
          class="shareButton"
          @click="showShareIdeaDialog"
        >
          <img src="~assets/images/idea-card/share.png" alt="Share" />
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { graphqlOperation } from '@aws-amplify/api'
import ShareIdeaByEmailDialog from '@/components/dialogs/ShareIdeaByEmail'
import ActOnIdea from '@/components/ideaDetail/ActOnIdea'
import PencilIcon from '@/components/layout/svgIcons/PencilIcon'
import TrashIcon from '@/components/layout/svgIcons/TrashIcon'
import LockedIcon from '@/components/layout/svgIcons/LockedIcon'
import UnlockedIcon from '@/components/layout/svgIcons/UnlockedIcon'
import DefaultDialog from '@/components/dialogs/DefaultDialog'
import makeIdeaPrivate from '~/graphql/mutations/makeIdeaPrivate'
import makeIdeaPublic from '~/graphql/mutations/makeIdeaPublic'

export default {
  components: {
    ActOnIdea,
    UnlockedIcon,
    LockedIcon,
    TrashIcon,
    PencilIcon,
    ShareIdeaByEmailDialog,
    DefaultDialog
  },

  props: {
    preview: { type: Boolean, default: false },
    editable: { type: Boolean, default: false },
    idea: { type: Object, required: true },
    shareIdea: { type: Boolean, default: false }
  },

  data() {
    return {
      iconColor: '#5B41BB',
      showEmailShareDialog: false,
      showMakeIdeaPrivate: false,
      showMakeIdeaPublic: false
    }
  },

  computed: {
    isPrivate() {
      return this.idea.visibility === 'PRIVATE'
    },

    ideaLink() {
      return `/i/${this.idea.shortId}/${this.idea.slug}`
    }
  },

  watch: {
    idea() {
      // This is a workaround, for some reason computed isPrivate doesn't update
      this.$forceUpdate()
    },

    shareIdea(val) {
      if (val) {
        this.showShareIdeaDialog()
        this.$emit('update:share-idea', false)
      }
    }
  },

  methods: {
    ...mapMutations({
      showProgressBar: 'layoutState/showProgressBar',
      hideProgressBar: 'layoutState/hideProgressBar'
    }),

    commentClicked() {
      this.$emit('comments-btn-click')
      if (this.preview) {
        this.$router.push({ path: this.ideaLink, query: { comment: 1 } })
      }
    },

    deleteIdea() {
      this.$emit('on-delete-idea')
    },

    onIdeaSaveStateChanged(val) {
      this.$emit('saved-state-changed', val)
    },

    onIdeaLikeStateChanged(val) {
      this.$emit('liked-state-changed', val)
    },

    async makeIdeaPrivate() {
      this.showProgressBar()
      try {
        const ideaId = this.idea.ideaId
        const result = await this.$amplifyApi.graphql(
          graphqlOperation(makeIdeaPrivate, { ideaId })
        )
        if (result.data.makeIdeaPrivate.ok) {
          this.$emit('on-idea-visibility-changed', { isPrivate: true })
        } else {
          this.$emit('on-idea-visibility-change-error', { isPrivate: true })
        }
      } catch (err) {
        this.$emit('on-idea-visibility-change-error', { isPrivate: true })
      }
      this.hideProgressBar()
      this.showMakeIdeaPrivate = false
    },

    async makeIdeaPublic() {
      this.showProgressBar()
      try {
        const ideaId = this.idea.ideaId
        const result = await this.$amplifyApi.graphql(
          graphqlOperation(makeIdeaPublic, { ideaId })
        )
        if (result.data.makeIdeaPublic.ok) {
          this.$emit('on-idea-visibility-changed', { isPrivate: false })
        } else {
          this.$emit('on-idea-visibility-change-error', { isPrivate: false })
        }
      } catch (err) {
        this.$emit('on-idea-visibility-change-error', { isPrivate: false })
      }
      this.hideProgressBar()
      this.showMakeIdeaPublic = false
    },

    toggleIdeaPrivacy() {
      if (this.isPrivate) {
        this.showMakeIdeaPublic = true
      } else {
        this.showMakeIdeaPrivate = true
      }
    },

    showShareIdeaDialog() {
      if (this.isMobile && navigator.share) {
        navigator.share({
          title: this.idea.title,
          url: window.location.href
        })
      } else {
        this.showEmailShareDialog = true
      }
    },

    enableEditMode() {
      this.$emit('enable-edit-mode')
    },

    onSharedIdeaOverEmail() {
      this.$notifier.show({
        color: 'green',
        message: 'Idea shared!',
        iconName: 'shared'
      })
      this.$emit('on-idea-shared')
    },

    onSharedIdeaOverEmailError() {
      this.$notifier.error("Can't share Idea")
    },

    onCopyShareLink() {
      this.$notifier.show({
        color: 'green',
        message: 'Link copied',
        iconName: 'copied'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.bold {
  font-weight: bold;
}

.v-list-item {
  margin: 1rem;
  border-radius: 10px;

  &:hover {
    background-color: #efecf8 !important;
  }

  &__title {
    display: flex;
    align-items: center;
  }
}

.menu-panel-container {
  width: 100%;
}

.v-menu__content {
  background-color: white;
  border: 1px solid $primary-color;
  border-radius: 10px;
}

.menu-button {
  position: absolute;
  top: 1%;
  right: 1%;
  z-index: 1;
  font-size: 18px;
  width: 30px;
  height: 30px;
  color: silver;
}

.menu-button-selected {
  border: 1px solid $secondary-color;
  border-radius: 100%;
  width: 30px;
  height: 30px;
  color: $secondary-color !important;
}

.idea-part__header__buttons-panel {
  width: 100%;
  padding-top: 4px; /* this is just to offset the buttons to match the baseline of the title, because the title font is a different height than the button icon height */
  padding-bottom: 4px;
  border-top: 2px solid $color-off-white;
  border-bottom: 2px solid $color-off-white;
  .privacyButton {
    /* color: #1867c0 !important; */
    color: #5cbbf6 !important;
  }

  .actions-row {
    width: 85%;
    margin: 0 auto;
  }

  .img-count {
    display: flex;
    flex-direction: row;
    align-items: center;

    img {
      height: 18px;
    }

    .count {
      font-size: 14px;
      padding-top: 3px;
      padding-left: 4px;
    }
  }
}

.shareButton {
  img {
    height: 18px;
  }
}
</style>
