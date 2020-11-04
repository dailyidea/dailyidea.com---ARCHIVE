<template>
  <layout grey-bg>
    <idea-lightbox
      :idea="selectedIdea"
      :value="!!selectedIdea"
      @input="selectedIdea = null"
      @updated="ideaUpdated"
    />
    <template v-slot:header>
      <user-profile-header-section
        :profile-data="profileData"
        :is-my-profile="isMyProfile"
        :idea-count="ideas ? ideas.length : 0"
      ></user-profile-header-section>
    </template>
    <template>
      <div v-if="ideas.length" class="cards-container">
        <idea-short-card
          v-for="(idea, index) in ideas"
          :key="index"
          :idea="idea"
          @updated="i => $set(ideas, index, i)"
          @view-preview="i => (selectedIdea = i)"
        ></idea-short-card>
      </div>
      <slot v-if="!ideas.length" name="no-ideas" />
      <slot />
      <input
        ref="file"
        style="display: none"
        type="file"
        accept="image/*"
        @change="uploadImage($event)"
      />
      <user-profile-avatar-crop-dialog
        ref="UserProfileAvatarCropDialog"
      ></user-profile-avatar-crop-dialog>
    </template>
  </layout>
</template>

<script>
import UserProfileHeaderSection from './UserProfileHeaderSection'
import UserProfileAvatarCropDialog from './UserProfileAvatarCropDialog'
import Layout from '@/components/layout/Layout'
import IdeaLightbox from '@/components/ideaDetail/IdeaLightbox'
import IdeaShortCard from '@/components/ideaDetail/IdeaShortCard'

export default {
  components: {
    IdeaLightbox,
    Layout,
    UserProfileHeaderSection,
    UserProfileAvatarCropDialog,
    IdeaShortCard
  },

  props: {
    initialProfileData: { type: Object, required: true },
    ideas: { type: Array, required: true },
    loadMoreIdeasIsPossible: { type: Boolean, default: false }
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
      editData: { name: '', bio: '' },
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

.cards-container {
  margin: 0 auto;
  @media (min-width: $screen-md-min) {
    width: 650px;
  }

  .card {
    margin-top: 1rem !important;
  }
}
</style>
