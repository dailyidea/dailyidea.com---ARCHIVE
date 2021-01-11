<template>
  <div class="header-container">
    <div class="header-content">
      <v-row v-if="!isMyProfile" class="mobile-follow-header">
        <div class="follow-header-container">
          <div class="follow-header">
            <v-icon class="back-btn" @click="backClicked"
              >mdi mdi-chevron-left</v-icon
            >
            <div class="profile-text">Profile</div>
            <div></div>
            <v-btn
              v-if="!isFollowedByMe"
              class="follow-btn"
              @click="followBtnClicked"
              >Follow</v-btn
            >
            <v-btn v-else class="follow-btn" @click="unfollowBtnClicked"
              >Unfollow</v-btn
            >
          </div>
        </div>
      </v-row>
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
                <div class="name-follow">
                  <h1 class="info-section__title">{{ profileData.name }}</h1>
                  <span v-if="!isMyProfile" class="desktop-follow-header">
                    <v-btn
                      v-if="!isFollowedByMe"
                      class="follow-btn ml-4"
                      @click="followBtnClicked"
                      >Follow</v-btn
                    >
                    <v-btn
                      v-else
                      class="follow-btn ml-4"
                      @click="unfollowBtnClicked"
                      >Unfollow</v-btn
                    >
                  </span>
                </div>
                <div class="info-section__stats d-flex flex-row mt-3">
                  <div class="info-section__stats__stat">
                    <span>{{ profileData.ideasCreated }}</span>
                    <span>Ideas</span>
                  </div>
                  <!--<div class="pipe"></div>
                  <div class="info-section__stats__stat">
                    <span>{{ profileData.followersCount }}</span>
                    <span>Followers</span>
                  </div>
                  <div class="pipe"></div>
                  <div class="info-section__stats__stat">
                    <span>{{ profileData.followeesCount }}</span>
                    <span>Following</span>
                  </div>-->
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
            <div class="hidden-desktop hidden-landscape px-3">
              {{ profileData.bio }}
            </div>
          </div>
        </v-col>
      </v-row>
      <sliding-underline>
        <div class="profile-links">
          <nuxt-link
            :to="ideasLink"
            class="link pb-3"
            :class="{ active: page === 'profile' }"
          >
            <span
              v-if="isMyProfile"
              :class="{ 'link-highlight': page === 'profile' }"
              >{{
                linkText('My Ideas', 'profile', profileData.ideasCreated)
              }}</span
            >
            <span v-else :class="{ 'link-highlight': page === 'profile' }">{{
              linkText(
                `${profileData.name}'s Ideas`,
                'profile',
                profileData.ideasCreated
              )
            }}</span>
          </nuxt-link>
          <nuxt-link
            :to="savedLink"
            class="link pb-3"
            :class="{ active: page === 'saved-ideas' }"
          >
            <span :class="{ 'link-highlight': page === 'saved-ideas' }">{{
              linkText('Saved Ideas', 'saved-ideas')
            }}</span>
          </nuxt-link>
          <nuxt-link
            v-if="isMyProfile"
            :to="settingsLink"
            class="link pb-3"
            :class="{ active: page === 'settings' }"
          >
            <span :class="{ 'link-highlight': page === 'settings' }"
              >Settings</span
            >
          </nuxt-link>
        </div>
      </sliding-underline>
    </div>
  </div>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import { mapGetters } from 'vuex'
import UserProfileAvatar from './UserProfileAvatar'
import followUser from '~/graphql/mutations/followUser.js'
import userInfo from '~/graphql/query/userInfo.js'
import unfollowUser from '~/graphql/mutations/unfollowUser.js'
import SlidingUnderline from '@/components/layout/SlidingUnderline'

export default {
  components: { SlidingUnderline, UserProfileAvatar },

  props: {
    profileData: { type: Object, required: true },
    ideaCount: { type: Number, default: 0 },
    isMyProfile: { type: Boolean, requried: true }
  },

  data() {
    return {
      editMode: false,
      isFollowedByMe: false,
      pages: {
        profile: 'profile',
        'profile-userSlug': 'profile',
        'profile-userSlug-saved': 'saved-ideas',
        'profile-userSlug-settings': 'settings',
        'ideas-saved': 'saved-ideas',
        'ideas-me': 'profile'
      }
    }
  },

  computed: {
    ...mapGetters({ userId: 'userData/userId' }),

    ideasLink() {
      return `/profile/${this.profileData.slug}`
    },

    savedLink() {
      return `/profile/${this.profileData.slug}/saved`
    },

    settingsLink() {
      return `/profile/${this.profileData.slug}/settings`
    },

    page() {
      return this.pages[this.$route.name]
    }
  },

  mounted() {
    this.getFollowInfo()
  },

  methods: {
    backClicked() {
      this.$router.go(-1)
    },

    async unfollowBtnClicked() {
      await this.$amplifyApi.graphql(
        graphqlOperation(unfollowUser, { userId: this.profileData.userId })
      )

      this.getFollowInfo()
    },

    async followBtnClicked() {
      if (!this.userId) {
        return this.$router.push('/auth/login')
      }
      await this.$amplifyApi.graphql(
        graphqlOperation(followUser, { userId: this.profileData.userId })
      )

      this.getFollowInfo()
    },

    linkText(baseText, page, count = this.ideaCount) {
      if (this.page !== page) {
        return baseText
      }

      if (count > 0) {
        return baseText + ` (${count})`
      }

      return baseText
    },

    getFollowInfo() {
      // Coming to this page from certain other pages seems to set
      // profileData to null for a short time. This waits for profileData
      // to not be null if it is.

      setTimeout(
        async () => {
          const data = await this.$amplifyApi.graphql({
            query: userInfo,
            variables: { userId: this.profileData.userId }
          })

          this.isFollowedByMe = data.data.userInfo.userInfo.isFollowingByMe
          this.profileData.followersCount =
            data.data.userInfo.userInfo.followersCount
        },
        this.profileData !== null ? 0 : 500
      )
    }
  }
}
</script>

<style scoped lang="scss">
.name-follow {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

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

.header-container {
  display: flex;
  align-items: center;
  background-color: white;
  overflow: hidden;
}

.header-content {
  width: 100%;
  @media (min-width: $screen-md-min) {
    margin: 2rem auto 0;
    width: 650px;
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

.follow-header-container {
  width: 100%;
  border-bottom: 2px solid $light-grey;
  box-shadow: $card-shadow;

  .follow-header {
    position: relative;
    width: 80%;
    margin: 0 auto;
    height: 7vh;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .back-btn {
      cursor: pointer;
      color: $default-purple;
      font-size: 30px;
    }

    .profile-text {
      font-weight: bold;
      padding-right: 2rem;
    }

    .follow-btn {
      position: absolute;
      right: 0;
    }
  }
}

.follow-btn {
  background-color: $default-purple !important;
  text-transform: capitalize;
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

.desktop-follow-header {
  @media (max-width: $screen-sm-max) {
    display: none;
  }
}

.mobile-follow-header {
  @media (min-width: $screen-md-min) {
    display: none;
  }
}
</style>
