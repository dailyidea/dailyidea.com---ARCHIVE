<template>
  <layout :grey-bg="isGreyBG">
    <template v-slot:header>
      <div class="sub-header">
        <div class="sub-header-container">
          <span class="purple-text" @click="cancelClicked">Cancel</span>
          <span>Edit Profile</span>
          <span class="purple-text" @click="doneClicked">Done</span>
        </div>
      </div>
    </template>
    <template>
      <div class="card-container mx-auto">
        <idea-card expanded class="edit-card">
          <div class="edit-card__avatar-section">
            <img :src="avatar" @click="selectAvatar" />
            <span class="purple-text" @click="selectAvatar"
              >Edit profile photo</span
            >
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
          </div>
          <div class="edit-card__text-section border-top py-5 mt-4">
            <span class="text-title">Name</span>
            <input
              v-model="name"
              class="text-input"
              placeholder="The name shown on your ideas"
            />
          </div>
          <div class="edit-card__text-section border-top py-5">
            <span class="text-title">Bio</span>
            <textarea
              v-model="bio"
              class="text-input"
              placeholder="You have not set a bio yet"
            ></textarea>
          </div>
          <div
            class="edit-card__text-section border-top d-flex flex-column py-5"
          >
            <span class="bold pb-2">Account Details</span>
            <div>
              <span class="text-title">Email</span>
              <span class="text-body">{{ email }}</span>
            </div>
          </div>
          <div class="edit-card__text-section border-top pt-5">
            <span class="purple-text">Deactivate your account</span>
          </div>
        </idea-card>
      </div>
    </template>
  </layout>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import Layout from '@/components/layout/Layout'
import IdeaCard from '@/components/ideaDetail/IdeaCard'
import VisualNotifier from '@/components/VisualNotifier'
import UserProfileAvatarCropDialog from '@/components/profilePage/UserProfileAvatarCropDialog'
import uploadAvatar from '~/graphql/mutations/uploadAvatar'
import userInfoBySlug from '@/graphql/query/userInfoBySlug'
import updateProfileInfo from '@/graphql/mutations/updateProfileInfo'

export default {
  name: 'Edit',
  components: {
    Layout,
    IdeaCard,
    UserProfileAvatarCropDialog,
    VisualNotifier
  },
  middleware: 'authenticated',
  async asyncData({ app, store, route }) {
    const userSlug = store.getters['userData/slug']
    const userInfoRequest = await app.$amplifyApi.graphql(
      graphqlOperation(userInfoBySlug, { slug: userSlug })
    )

    const userInfo = userInfoRequest.data.userInfoBySlug.userInfo

    const avatar = userInfo.avatar
    const name = userInfo.name
    const bio = userInfo.bio
    const email = store.getters['userData/email']

    return {
      avatar,
      name,
      userSlug,
      bio,
      email
    }
  },

  computed: {
    isGreyBG() {
      return !this.isMobile
    },

    profilePage() {
      const userSlug = this.$store.getters['userData/slug']
      return `/profile/${userSlug}`
    }
  },

  methods: {
    cancelClicked() {
      this.$router.push(this.profilePage)
    },

    async doneClicked() {
      await this.saveChanges()
      this.$router.push(this.profilePage)
    },

    selectAvatar() {
      this.$refs.file.click()
    },

    uploadImage(event) {
      // Reference to the DOM input element
      const input = event.target
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        const reader = new FileReader()
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = async e => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          // this.image = e.target.result;
          try {
            const avatarBase64value = await this.$refs.UserProfileAvatarCropDialog.show(
              e.target.result
            )
            this.uploadAvatar(avatarBase64value)
          } catch (e) {
            ;(() => {})()
          }
        }
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0])
      }
    },

    async saveChanges() {
      try {
        const resp = await this.$amplifyApi.graphql(
          graphqlOperation(updateProfileInfo, {
            bio: this.bio,
            name: this.name,
            interestedInTags: [] // this.editData.interestedInTags
          })
        )

        if (resp.data.updateProfileInfo.result.ok) {
          this.bio = resp.data.updateProfileInfo.updatedInfo.bio
          this.name = resp.data.updateProfileInfo.updatedInfo.name
          this.slug = resp.data.updateProfileInfo.updatedInfo.slug
          /*
          this.interestedInTags =
            resp.data.updateProfileInfo.updatedInfo.interestedInTags
          */
          this.$store.commit('userData/updateUserName', this.name)
          this.$store.commit('userData/updateUserSlug', this.slug)
          this.$refs.notifier.success('Profile Updated')
        } else {
          this.$refs.notifier.error(
            resp.data.updateProfileInfo.result.error || 'Cannot update profile'
          )
        }
      } catch (err) {
        this.$refs.notifier.error('Cannot update profile')
      }
    },

    async uploadAvatar(avatarBase64value) {
      this.$store.commit('layoutState/showProgressBar')
      try {
        const response = await this.$amplifyApi.graphql(
          graphqlOperation(uploadAvatar, {
            avatar: avatarBase64value.split(',')[1]
          })
        )
        const newAvatarUrl = response.data.uploadAvatar.avatar
        this.avatar = newAvatarUrl
        this.$store.commit('userData/updateUserAvatar', newAvatarUrl)
        this.$refs.notifier.success('Avatar updated')
      } catch (e) {
        this.$refs.notifier.error('Error during avatar updating')
      }
      this.$store.commit('layoutState/hideProgressBar')
    }
  }
}
</script>

<style scoped lang="scss">
.purple-text {
  color: $primary-color;
  cursor: pointer;
}

.sub-header {
  background-color: white;
  height: 50px;
  width: 100%;
}

.sub-header-container {
  width: 60%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media (max-width: $screen-sm-max) {
    width: 90%;
  }
}

.card-container {
  width: 100%;
  @media (min-width: $screen-md-min) {
    width: 60vw;
  }
}

.border-top {
  border-top: 2px solid $light-grey;
  width: 100%;
}

.bold {
  font-weight: bold;
}

.edit-card {
  padding: 2rem;
  &__avatar-section {
    img {
      border-radius: 100%;
      margin: 1rem;
      width: 110px;
      height: 110px;
      cursor: pointer;
    }

    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__text-section {
    display: flex;
    flex-direction: row;
    .text-title {
      position: absolute;
      font-weight: bold;
    }

    .text-body {
      color: $dark-grey;
      margin-left: 6rem;
      @media (max-width: $screen-sm-max) {
        margin-left: 5rem;
      }
    }

    .text-input::placeholder {
      opacity: 1;
      color: $dark-grey;
    }

    .text-input {
      display: flex;
      margin: auto 0;
      width: 70%;
      resize: none;
      color: $dark-grey;
      margin-left: 6rem;
      @media (max-width: $screen-sm-max) {
        margin-left: 5rem;
      }
    }
  }

  @media (max-width: $screen-sm-max) {
    border: none !important;
    box-shadow: none !important;
    padding: 0;
  }
}
</style>
