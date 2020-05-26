<template>
  <div class="idea-part__header__buttons-panel">
    <v-btn
      v-if="editable"
      x-small
      text
      icon
      color="gray"
      class="privacyButton"
      @click="toggleIdeaPrivacy"
    >
      <v-icon v-if="isPrivate">mdi-lock</v-icon>
      <v-icon v-else>mdi-lock-open-variant-outline</v-icon>
    </v-btn>
    <v-btn x-small icon text class="shareButton">
      <v-icon @click="showShareIdeaDialog">share</v-icon>
    </v-btn>
    <v-menu v-if="editable" offset-y left transition="slide-y-transition">
      <template v-slot:activator="{ on }">
        <v-btn x-small icon v-on="on">
          <v-icon class="moreActionsButton">fas fa-ellipsis-v</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="enableEditMode">
          <v-list-item-title>
            <v-icon small class="editButton">mdi-pencil</v-icon>
            <span>Edit Idea</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="deleteIdea">
          <v-list-item-title>
            <v-icon small class="deleteButton">mdi-trash-can-outline</v-icon>
            <span>Delete Idea</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <act-on-idea
      v-if="!editable"
      action="like"
      @likedStateChanged="onIdeaLikeStateChanged"
    ></act-on-idea>
    <act-on-idea
      v-if="!editable"
      action="save"
      @savedStateChanged="onIdeaSaveStateChanged"
    ></act-on-idea>
    <ShareIdeaByEmailDialog
      :idea-id="$route.params.ideaId"
      :idea-owner-id="$route.params.userId"
      :visible="showEmailShareDialog"
      @success="onSharedIdeaOverEmail"
      @error="onSharedIdeaOverEmailError"
      @close="showEmailShareDialog = false"
      @onCopyShareLink="onCopyShareLink"
    ></ShareIdeaByEmailDialog>
    <make-idea-private-dialog
      ref="makeIdeaPrivateDialog"
    ></make-idea-private-dialog>
    <make-idea-public-dialog
      ref="makeIdeaPublicDialog"
    ></make-idea-public-dialog>
  </div>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import ShareIdeaByEmailDialog from '@/components/dialogs/shareIdeaByEmail'
import ActOnIdea from '@/components/ideaDetail/ActOnIdea'
import makeIdeaPrivate from '~/graphql/mutations/makeIdeaPrivate'
import makeIdeaPublic from '~/graphql/mutations/makeIdeaPublic'
import makeIdeaPrivateDialog from '~/components/dialogs/makeIdeaPrivateDialog'
import makeIdeaPublicDialog from '~/components/dialogs/makeIdeaPublicDialog'

export default {
  name: 'MenuPanel',
  components: {
    ActOnIdea,
    ShareIdeaByEmailDialog,
    makeIdeaPrivateDialog,
    makeIdeaPublicDialog
  },
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    idea: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showEmailShareDialog: false
    }
  },
  computed: {
    isPrivate() {
      return this.idea.visibility === 'PRIVATE'
    }
  },
  methods: {
    deleteIdea() {
      this.$emit('onDeleteIdea')
    },
    onIdeaSaveStateChanged(val) {
      this.$emit('savedStateChanged', val)
    },
    onIdeaLikeStateChanged(val) {
      this.$emit('likedStateChanged', val);
    },
    async makeIdeaPrivate() {
      const confirmed = await this.$refs.makeIdeaPrivateDialog.show()
      if (!confirmed) {
        return
      }
      this.$store.commit('layoutState/showProgressBar')
      try {
        const ideaId = this.idea.ideaId
        const result = await this.$amplifyApi.graphql(
          graphqlOperation(makeIdeaPrivate, {
            ideaId
          })
        )
        if (result.data.makeIdeaPrivate.ok) {
          this.$emit('onIdeaVisibilityChanged', { isPrivate: true })
        } else {
          this.$emit('onIdeaVisibilityChangeError', { isPrivate: true })
        }
      } catch (err) {
        this.$emit('onIdeaVisibilityChangeError', { isPrivate: true })
      }
      this.$store.commit('layoutState/hideProgressBar')
    },
    async makeIdeaPublic() {
      const confirmed = await this.$refs.makeIdeaPublicDialog.show()
      if (!confirmed) {
        return
      }
      this.$store.commit('layoutState/showProgressBar')
      try {
        const ideaId = this.idea.ideaId
        const result = await this.$amplifyApi.graphql(
          graphqlOperation(makeIdeaPublic, {
            ideaId
          })
        )
        if (result.data.makeIdeaPublic.ok) {
          this.$emit('onIdeaVisibilityChanged', { isPrivate: false })
        } else {
          this.$emit('onIdeaVisibilityChangeError', { isPrivate: false })
        }
      } catch (err) {
        this.$emit('onIdeaVisibilityChangeError', { isPrivate: false })
      }
      this.$store.commit('layoutState/hideProgressBar')
    },
    toggleIdeaPrivacy() {
      if (this.isPrivate) {
        this.makeIdeaPublic()
      } else {
        this.makeIdeaPrivate()
      }
    },
    showShareIdeaDialog() {
      this.showEmailShareDialog = true
    },
    enableEditMode() {
      this.$emit('enableEditMode')
    },
    onSharedIdeaOverEmail() {
      this.$emit('onNotification', { type: 'success', message: 'Idea shared!' })
      this.$emit('onIdeaShared')
    },
    onSharedIdeaOverEmailError() {
      this.$emit('onNotification', {
        type: 'error',
        message: "Can't share Idea"
      })
    },
    onCopyShareLink() {
      this.$emit('onNotification', { type: 'success', message: 'Link copied' })
    }
  }
}
</script>

<style scoped lang="scss">
.idea-part__header__buttons-panel {
  padding-top: 4px; /* this is just to offset the buttons to match the baseline of the title, because the title font is a different height than the button icon height */
  .privacyButton {
    /* color: #1867c0 !important; */
    color: #5cbbf6 !important;
  }
  .shareButton {
    color: #2cbe4e !important;
  }
  .moreActionsButton {
    color: silver !important;
  }
}
</style>
