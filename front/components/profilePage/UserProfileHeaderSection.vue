<template>
  <v-row class="header-container">
    <v-col></v-col>
    <v-col class="d-flex flex-row align-center">
      <div class="d-flex flex-row justify-space-around">
        <user-profile-avatar
          :profile-data="profileData"
          :is-my-profile="isMyProfile"
          @select-avatar="selectAvatar"
        ></user-profile-avatar>
        <div class="info-section pl-3">
          <h1 class="info-section__title">{{ profileData.name }}</h1>
          <div class="info-section__stats d-flex flex-row">
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
          <div class="info-section__bio">{{ profileData.bio }}</div>
        </div>
        <div class="bell">
          (BELL)
        </div>
      </div>
    </v-col>
    <v-col></v-col>
  </v-row>
</template>

<script>
// import UserProfileAvatarCropDialog from './UserProfileAvatarCropDialog'
import UserProfileAvatar from './UserProfileAvatar'

export default {
  name: 'UserProfileHeaderSection',
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
  components: {
    // UserProfileAvatarCropDialog,
    UserProfileAvatar
  }
}
</script>

<style scoped lang="scss">
.header-container {
  width: 100vw;
  height: 30vh;
  background-color: white;
}

.info-section {
  width: 25vw;
  
  &__title {
    font-weight: 400;
    font-size: 2rem;
  }

  &__stats {
    
    .pipe {
      background-color: $dark-grey;
      width: 2px;
      height: 25px;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }

    &__stat {
      color: $dark-grey;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
