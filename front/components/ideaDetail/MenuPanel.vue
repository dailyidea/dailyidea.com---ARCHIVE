<template>
  <div class="idea-part__header__buttons-panel">
    <v-btn
      text
      icon
      :disabled="!editable"
      color="gray"
      width="48"
      height="48"
      @click="toggleIdeaPrivacy"
    >
      <img
        v-if="isPrivate"
        class=""
        height="22"
        src="~/assets/images/privateIdea.png"
      />
      <img v-else class="" height="22" src="~/assets/images/publicIdea.png" />
    </v-btn>
    <v-btn icon width="48" height="48" @click="showShareIdeaDialog">
      <v-icon>share</v-icon>
    </v-btn>
    <v-menu v-if="editable" offset-y left transition="slide-y-transition">
      <template v-slot:activator="{ on }">
        <v-btn icon width="48" height="48" v-on="on">
          <v-icon size="22">fas fa-ellipsis-v</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="enableEditMode">
          <v-list-item-title>
            <v-icon size="18" style="vertical-align: middle; width: 21px"
              >mdi-pencil</v-icon
            >
            <span style="vertical-align: middle">
              Edit Idea</span
            ></v-list-item-title
          >
        </v-list-item>
        <v-list-item @click="deleteIdea">
          <v-list-item-title>
            <v-icon size="18" style="vertical-align: middle; width: 21px"
              >fas fa-trash</v-icon
            >
            <span style="vertical-align: middle">
              Delete Idea</span
            ></v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
    <save-idea-bookmark
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
  </div>
</template>

<script>
import ShareIdeaByEmailDialog from '@/components/dialogs/shareIdeaByEmail'
import SaveIdeaBookmark from '@/components/ideaDetail/SaveIdeaBookmark'

export default {
  name: 'MenuPanel',
  components: { SaveIdeaBookmark, ShareIdeaByEmailDialog },
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    isPrivate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showEmailShareDialog: false
    }
  },
  methods: {
    deleteIdea() {
      this.$emit('onDeleteIdea')
    },
    onIdeaSaveStateChanged(val) {
      this.$emit('savedStateChanged', val)
    },
    toggleIdeaPrivacy() {},
    showShareIdeaDialog() {
      this.showEmailShareDialog = true
    },
    enableEditMode() {
      this.$emit('enableEditMode')
    },
    onSharedIdeaOverEmail() {
      this.$emit('onNotification', { type: 'success', message: 'Idea shared!' })
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
