<template>
  <div class="header-container ">
    <div class="header-content">
      <v-row>
        <v-col class="d-flex flex-column align-center">
          <div class="info-container">
            <div class="d-flex flex-row">
              <div class="mr-5">
                <user-profile-avatar
                  :profile-data="profileData"
                ></user-profile-avatar>
              </div>
              <div class="info-section pl-3 pb-3 d-flex flex-column">
                <h1 class="info-section__title">{{ profileData.name }}</h1>
                <div class="info-section__stats d-flex flex-row mt-3">
                  <div class="info-section__stats__stat">
                    <span>{{ profileData.ideasCreated }}</span>
                    <span>Ideas</span>
                  </div>
                  <div class="pipe"></div>
                  <div class="info-section__stats__stat">
                    <span>{{ profileData.followersCount }}</span>
                    <span>Followers</span>
                  </div>
                  <div class="pipe"></div>
                  <div class="info-section__stats__stat">
                    <span>{{ profileData.followeesCount }}</span>
                    <span>Following</span>
                  </div>
                </div>
                <div class="info-section__bio mt-3 hidden-mobile-portrait">
                  {{ profileData.bio }}
                </div>
                <nuxt-link to="/profile/edit" class="hidden-sm-and-down">
                  <div v-if="isMyProfile" class="info-section__edit mt-3">
                    Edit
                  </div>
                </nuxt-link>
              </div>
            </div>
            <div class="hidden-desktop hidden-landscape">
              {{ profileData.bio }}
            </div>
          </div>
        </v-col>
      </v-row>
      <div class="profile-links">
        <nuxt-link
          :to="ideasLink"
          class="link pb-3"
          :class="{ active: page === 'profile' }"
        >
          <link-text
            v-if="isMyProfile"
            :active="page === 'profile'"
            :text="linkText('My Ideas', 'profile')"
          ></link-text>
          <link-text
            v-else
            :active="page === 'profile'"
            :text="linkText(`${profileData.name}'s Ideas`, 'profile')"
          ></link-text>
        </nuxt-link>
        <nuxt-link
          :to="savedLink"
          class="link pb-3"
          :class="{ active: page === 'saved-ideas' }"
        >
          <link-text
            :active="page === 'saved-ideas'"
            :text="linkText('Saved Ideas', 'saved-ideas')"
          ></link-text>
        </nuxt-link>
        <nuxt-link
          v-if="isMyProfile"
          to="/settings"
          class="link pb-3"
          :class="{ active: page === 'settings' }"
        >
          <link-text text="Settings" :active="page === 'settings'"></link-text>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import UserProfileAvatar from './UserProfileAvatar'
import LinkText from '@/components/layout/LinkText.vue'

export default {
  name: 'UserProfileHeaderSection',
  components: {
    // UserProfileAvatarCropDialog,
    UserProfileAvatar,
    LinkText
  },
  props: {
    selectAvatar: {
      type: Function,
      required: true
    },

    profileData: {
      type: Object,
      required: true
    },

    ideaCount: {
      type: Number,
      default: 0
    },

    isMyProfile: {
      type: Boolean,
      requried: true
    }
  },
  data() {
    return {
      editMode: false,
      pages: {
        profile: 'profile',
        'profile-userSlug': 'profile',
        'profile-userSlug-saved': 'saved-ideas',
        settings: 'settings',
        'ideas-saved': 'saved-ideas',
        'ideas-me': 'profile'
      }
    }
  },
  computed: {
    ideasLink() {
      return `/profile/${this.profileData.slug}`
    },

    savedLink() {
      return `/profile/${this.profileData.slug}/saved`
    },

    page() {
      return this.pages[this.$route.name]
    }
  },
  methods: {
    linkText(baseText, page) {
      if (this.page !== page) {
        return baseText
      }

      if (this.ideaCount > 0) {
        return baseText + ` (${this.ideaCount})`
      }

      return baseText
    }
  }
}
</script>

<style scoped lang="scss">
.hidden-landscape {
  @media (orientation: landscape) {
    display: none;
  }
}

.hidden-desktop {
  @media (min-width: $screen-md-min) {
    display: none;
  }
}

.hidden-mobile-portrait {
  @media (max-width: $screen-sm-max) and (orientation: portrait) {
    display: none;
  }
}

.link {
  color: black;
  text-decoration: none;
}

.active {
  text-decoration: none;
  border-bottom: 2px solid $secondary-color;
}

.header-container {
  display: flex;
  align-items: center;
  width: 100vw;
  background-color: white;
}

.header-content {
  @media (min-width: $screen-md-min) {
    margin: 0 auto;
    margin-top: 2rem;
  }

  @media (max-width: $screen-sm-max) {
    width: 100%;
  }
}

.info-container {
  display: flex;
  flex-direction: column;
}

.profile-links {
  border-top: 2px solid $light-grey;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
}

.info-section {
  &__title {
    font-weight: 400;
    font-size: 2rem;
  }

  &__edit {
    cursor: pointer;
    color: $primary-color;
  }

  &__stats {
    font-size: 0.85rem;
    .pipe {
      margin: auto 0;
      background-color: $dark-grey;
      width: 1px;
      height: 1.5rem;
      margin-left: 0.8rem;
      margin-right: 0.8rem;
    }

    &__stat {
      color: $dark-grey;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  &__bio {
    font-size: 1.1rem;
  }
}
</style>
