<template>
  <layout grey-bg :show-overlay="showOverlay">
    <template v-slot:overlay>
      <div class="overlay">
        <div class="overlay-card">
          <idea-card
            expanded
            close-btn
            allow-mobile-scroll
            :idea="selectedIdea"
            @exit-pressed="handleExitPressed"
            @updated="ideaUpdated"
          ></idea-card>
        </div>
      </div>
    </template>
    <template v-slot:header>
      <user-profile-header-section
        :profile-data="profileData"
        :is-my-profile="isMyProfile"
        :idea-count="ideas ? ideas.length : 0"
      ></user-profile-header-section>
    </template>
    <template>
      <slot :handle-view-preview="handleViewPreview" />
      <input
        ref="file"
        style="display: none"
        type="file"
        accept="image/*"
        @change="uploadImage($event)"
      />
      <visual-notifier ref="notifier"></visual-notifier>
      <user-profile-avatar-crop-dialog
        ref="UserProfileAvatarCropDialog"
      ></user-profile-avatar-crop-dialog>
    </template>
  </layout>
</template>

<script>
import UserProfileHeaderSection from './UserProfileHeaderSection'
import UserProfileAvatarCropDialog from './UserProfileAvatarCropDialog'
import VisualNotifier from '@/components/VisualNotifier'
import Layout from '@/components/layout/Layout'
import IdeaCard from '@/components/ideaDetail/IdeaCard'

export default {
  name: 'UsersProfile',
  components: {
    Layout,
    IdeaCard,
    UserProfileHeaderSection,
    VisualNotifier,
    UserProfileAvatarCropDialog
  },
  props: {
    initialProfileData: {
      type: Object,
      required: true
    },
    ideas: {
      type: Array,
      required: true
    },
    loadMoreIdeasIsPossible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      profileData: {
        userId: undefined,
        name: undefined,
        slug: undefined,
        avatar: undefined,
        bio: undefined,
        followersCount: 0,
        followeesCount: 0,
        ideasCreated: 0,
        interestedInTags: null
      },
      editMode: false,
      editData: {
        name: '',
        bio: ''
      },
      savingChanges: false,
      image: undefined,
      showOverlay: false,
      selectedIdea: null
    }
  },
  computed: {
    isMyProfile() {
      return this.$store.getters['userData/userId'] === this.profileData.userId
    }
  },
  mounted() {
    this.profileData = this.initialProfileData
  },
  methods: {
    handleViewPreview(idea) {
      this.showOverlay = true
      this.selectedIdea = idea
    },

    handleExitPressed() {
      this.showOverlay = false
      this.selectedIdea = null
    },

    ideaUpdated(idea) {
      this.$emit('idea-updated', this.selectedIdea, idea)
      this.selectedIdea = idea
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';

.profileStats {
  .stat {
    font-weight: 900;
  }
}

.editMode {
  .profileStats {
    .stat,
    .label {
      color: $color-muted-grey;
    }
  }
}
</style>
