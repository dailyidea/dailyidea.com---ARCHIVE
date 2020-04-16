<template>
  <div class="idea-part__header__buttons-panel">
    <v-btn
      text
      icon
      v-if="editable"
      color="gray"
      @click="toggleIdeaPrivacy"
    >
      <v-icon v-if="isPrivate">mdi-lock</v-icon>
      <v-icon v-else>mdi-lock-open-variant-outline</v-icon>
    </v-btn>
    <v-btn icon @click="showShareIdeaDialog">
      <v-icon>share</v-icon>
    </v-btn>
    <v-menu v-if="editable" offset-y left transition="slide-y-transition">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>fas fa-ellipsis-v</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="enableEditMode">
          <v-list-item-title>
            <v-icon>mdi-pencil</v-icon>
            <span>Edit Idea</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="deleteIdea">
          <v-list-item-title>
            <v-icon>fas fa-trash</v-icon>
            <span>Delete Idea</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <save-idea-bookmark
      v-if="!editable"
      @savedStateChanged="onIdeaSaveStateChanged"
    ></save-idea-bookmark>
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
import SaveIdeaBookmark from '@/components/ideaDetail/SaveIdeaBookmark'
import makeIdeaPrivate from '~/graphql/mutations/makeIdeaPrivate'
import makeIdeaPublic from '~/graphql/mutations/makeIdeaPublic'
import makeIdeaPrivateDialog from '~/components/dialogs/makeIdeaPrivateDialog'
import makeIdeaPublicDialog from '~/components/dialogs/makeIdeaPublicDialog'

export default {
  name: 'MenuPanel',
  components: {
    SaveIdeaBookmark,
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
$base-height: 50px;
.idea-part__header__buttons-panel {
  @media (max-width: $screen-xs-max) {
  }
  @media (min-width: $screen-sm-min) {
    display: inline-block;
    float: right;
    width: 200px;
  }
  height: $base-height;
  text-align: right;
  vertical-align: top;

  /*font-size: 22px;*/
  /*background-color: #d2a7af;*/
  min-height: 50px;
}
</style>
