<template>
  <layout grey-bg>
    <template v-slot:header>
      <user-profile-header-section
        :profile-data="profileData"
        :is-my-profile="isMyProfile"
        :select-avatar="selectAvatar"
        :idea-count="ideas.length"
      ></user-profile-header-section>
    </template>
    <template>
      <slot />
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

export default {
  name: 'UsersProfile',
  components: {
    Layout,
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
      image: undefined
    }
  },
  computed: {
    isMyProfile() {
      return this.$store.getters['userData/userId'] === this.profileData.userId
    }
  },
  created() {
    this.profileData = this.initialProfileData
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
