<template>
  <div class="header-container ">
    <div class="header-content">
      <v-row>
        <v-col></v-col>
        <v-col class="d-flex flex-row align-center">
          <div class="d-flex flex-row justify-space-around info-container">
            <div class="mr-5">
              <user-profile-avatar
                :profile-data="profileData"
                :is-my-profile="isMyProfile"
                @select-avatar="selectAvatar"
              ></user-profile-avatar>
            </div>
            <div class="info-section pl-3 pb-3">
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
              <div class="info-section__bio mt-3">
                {{ profileData.bio }}
              </div>
              <div v-if="isMyProfile" class="info-section__edit mt-3">Edit</div>
            </div>
          </div>
        </v-col>
        <v-col></v-col>
      </v-row>
      <div class="d-flex flex-row align-center justify-space-between px-6 pt-1">
        <nuxt-link
          to="#"
          class="link pb-3"
          :class="{ active: page === 'profile' }"
        >
          <link-text
            v-if="isMyProfile"
            :active="page === 'profile'"
            text="My Ideas"
          ></link-text>
          <link-text
            v-else
            :active="page === 'profile'"
            :text="`${profileData.name}'s Ideas`"
          ></link-text>
        </nuxt-link>
        <nuxt-link
          to="#"
          class="link pb-3"
          :class="{ active: page === 'saved-ideas' }"
        >
          <link-text
            text="Saved Ideas"
            :active="page === 'saved-ideas'"
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
// import UserProfileAvatarCropDialog from './UserProfileAvatarCropDialog'
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

    isMyProfile: {
      type: Boolean,
      requried: true
    }
  },
  data() {
    return {
      pages: {
        profile: 'profile',
        'profile-userSlug': 'profile',
        settings: 'settings',
        'ideas-saved': 'saved-ideas'
      }
    }
  },
  computed: {
    page() {
      return this.pages[this.$route.name]
    }
  }
}
</script>

<style scoped lang="scss">
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
  margin: 0 auto;
  margin-top: 2rem;
}

.info-container {
  border-bottom: 2px solid $light-grey;
}

.info-section {
  width: 25vw;

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
