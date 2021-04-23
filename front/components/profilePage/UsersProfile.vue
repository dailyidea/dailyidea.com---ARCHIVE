<template>
  <layout grey-bg>
    <idea-lightbox
      ref="ideaLightbox"
      :idea="selectedIdea"
      :value="!!selectedIdea"
      @input="selectedIdea = null"
      @updated="ideaUpdated"
      @deleted="
        i => {
          $emit('idea-deleted', i)
          selectedIdea = null
        }
      "
      @unsaved="$emit('unsaved', selectedIdea)"
      @comments-click="() => commentsBtnClicked(selectedIdea)"
    />
    <template v-slot:header>
      <user-profile-header-section
        :profile-data="profileData"
        :is-my-profile="isMyProfile"
        :idea-count="ideas ? ideas.length : 0"
      ></user-profile-header-section>
    </template>
    <template>
      <div
        v-if="routerLoading"
        class="mt-6 d-flex flex-column justify-center align-center"
      >
        <img
          class="loading-image"
          src="~assets/images/general/loading.gif"
          alt="Loading"
          width="197"
        />
        <div class="loading-caption">loading...</div>
      </div>
      <div v-else>
        <div v-if="ideas.length" class="cards-container">
          <idea-short-card
            v-for="(idea, index) in ideas"
            :key="index"
            :idea="idea"
            @updated="ideaUpdated"
            @deleted="i => $emit('idea-deleted', i)"
            @expand="() => (selectedIdea = idea)"
            @comments-click="() => commentsBtnClicked(idea)"
            @unsaved="$emit('unsaved', idea)"
          ></idea-short-card>
          <div v-if="loading" class="text-center mt-5">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
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
      </div>
    </template>
    <idea-comments-dialog
      v-model="showCommnetsDialog"
      :idea="ideaForComments"
    />
  </layout>
</template>

<script>
import { mapState } from 'vuex'
import UserProfileHeaderSection from './UserProfileHeaderSection'
import UserProfileAvatarCropDialog from './UserProfileAvatarCropDialog'
import IdeaShortCard from '@/components/ideaDetail/IdeaShortCard'
import Layout from '@/components/layout/Layout'
import IdeaLightbox from '@/components/ideaDetail/IdeaLightbox'
import IdeaCommentsDialog from '@/components/dialogs/IdeaCommentsDialog'

export default {
  components: {
    IdeaCommentsDialog,
    IdeaLightbox,
    Layout,
    UserProfileHeaderSection,
    UserProfileAvatarCropDialog,
    IdeaShortCard
  },

  props: {
    initialProfileData: { type: Object, required: true },
    ideas: { type: Array, required: true },
    nextToken: { type: String, default: null },
    loading: { type: Boolean, default: false }
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
      showCommnetsDialog: false,
      selectedIdea: null,
      ideaForComments: {}
    }
  },

  computed: {
    ...mapState({
      routerLoading: s => s.routerLoading
    }),

    isMyProfile() {
      return this.$store.getters['userData/userId'] === this.profileData.userId
    }
  },

  watch: {
    selectedIdea(idea, prevIdea) {
      if (prevIdea) {
        window.history.back()
      }

      if (idea) {
        window.history.pushState('', '', `/i/${idea.shortId}/${idea.slug}`)
      }
    }
  },

  mounted() {
    this.profileData = this.initialProfileData
  },

  methods: {
    ideaUpdated(idea) {
      this.$emit('idea-updated', idea)
      if (this.selectedIdea) {
        this.selectedIdea = idea
      }
    },

    commentsBtnClicked(idea) {
      this.ideaForComments = idea
      this.showCommnetsDialog = true
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

.loading-caption {
  margin-top: 2rem;
  padding-left: 1rem;
  font-size: 1.5rem;
  color: #4a4759;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
