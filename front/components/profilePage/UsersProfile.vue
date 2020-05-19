<template>
  <layout>
    <v-row class="header" :class="{ editMode: editMode }">
      <!-- left side image on desktop -->
      <v-col
        class="profileImage d-flex align-start justify-center"
        cols="12"
        sm="4"
      >
        <user-profile-avatar 
          :profile-data="profileData"
          :is-my-profile="isMyProfile"
          @select-avatar="selectAvatar"
        >
        </user-profile-avatar>
      </v-col>

      <!-- right side profile info on desktop -->
      <v-col cols="12" sm="8">
        <!-- username -->
        <v-row>
          <v-col>
            <v-text-field
              v-if="editMode"
              v-model="editData.name"
              :disabled="savingChanges"
              maxlength="128"
              :rules="nameRules"
              dense
              background-color="yellow lighten-4"
              hide-details="auto"
              autofocus
              placeholder="Your Name"
            ></v-text-field>
            <h2 v-else>{{ profileData.name }}</h2>
          </v-col>
          <v-col v-if="!editMode" cols="auto">
            <v-tooltip v-if="isMyProfile" top>
              <template v-slot:activator="{ on }">
                <v-chip outlined color="grey lighten-1" @click="enableEditMode"
                  >Edit Profile
                  <v-icon right small v-on="on">mdi-pencil</v-icon>
                </v-chip>
              </template>
              <span>Click to update your name or bio</span>
            </v-tooltip>
          </v-col>
          <v-col v-else cols="auto">
            <v-btn text rounded @click="disableEditMode">Cancel</v-btn>
            <v-btn rounded :loading="savingChanges" @click="saveChanges"
              >Save</v-btn
            >
          </v-col>
        </v-row>

        <!-- counters / stats -->
        <v-row class="profileStats">
          <v-col id="ideasCount" cols="auto">
            <span class="stat">
              {{ profileData.ideasCreated }}
            </span>
            <span class="label">
              ideas
            </span>
          </v-col>
          <v-col id="followersCount" cols="auto">
            <span class="stat">
              {{ profileData.followersCount }}
            </span>
            <span class="label">
              followers
            </span>
          </v-col>
          <v-col id="followeesCount" cols="auto">
            <span class="stat">
              {{ profileData.followeesCount }}
            </span>
            <span class="label">
              following
            </span>
          </v-col>
        </v-row>
        <!-- end counters / stats -->

        <!-- profile bio -->
        <v-row>
          <v-col>
            <div class="profileBio">
              <span v-if="!editMode">{{ profileData.bio }}</span>
              <v-textarea
                v-else
                v-model="editData.bio"
                :rows="3"
                background-color="yellow lighten-4"
                dense
                hide-details="auto"
                maxlength="1000"
                :disabled="savingChanges"
                placeholder="Tell few words about yourself"
              ></v-textarea>
            </div>
          </v-col>
        </v-row>

        <!-- profile tags  -->
        <v-row>
          <v-col>
            <div
              v-if="
                editMode ||
                  (profileData.interestedInTags &&
                    profileData.interestedInTags.length)
              "
            >
              <div class="mb-2">Interested in:</div>

              <div v-if="!editMode">
                <v-chip
                  v-for="(item, index) in profileData.interestedInTags"
                  :key="index"
                  class="mr-1"
                  outlined
                  >{{ item }}
                </v-chip>
              </div>
              <div v-else>
                <v-combobox
                  v-model="editData.interestedInTags"
                  placeholder="Add few tags about what are you interested in"
                  :error-messages="errors.collect('tag')"
                  data-vv-name="tag"
                  hide-details="auto"
                  times
                  chips
                  background-color="yellow lighten-4"
                  dense
                  label=""
                  multiple
                  :disabled="savingChanges"
                >
                  <template
                    v-slot:selection="{ attrs, item, select, selected }"
                  >
                    <v-chip
                      v-bind="attrs"
                      :input-value="selected"
                      close
                      close-icon="mdi-close-circle-outline"
                      outlined
                      @click="() => {}"
                      @click:close="removeTag(item)"
                    >
                      {{ item }}
                    </v-chip>
                  </template>
                </v-combobox>
              </div>
            </div>
          </v-col>
        </v-row> </v-col
      ><!-- end right side of header --> </v-row
    ><!-- header info -->

    <!-- -->
    <v-row
      ><!-- ideas section -->
      <v-col>
        <div v-if="ideas.length">
          <div>
            <ideas-list-idea
              v-for="idea in ideas"
              :key="idea.ideaId"
              :idea="idea"
            ></ideas-list-idea>
          </div>
          <div v-if="loadMoreIdeasIsPossible" class="text-center">
            <router-link
              :to="
                isMyProfile
                  ? { name: 'ideas-me' }
                  : {
                      name: 'ideas-userSlug',
                      params: {
                        userSlug: profileData.slug
                      }
                    }
              "
            >
              <v-btn dark rounded
                >View all
                {{ isMyProfile ? 'My' : `${profileData.name}'s` }}
                Ideas</v-btn
              >
            </router-link>
          </div>
        </div>
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
      </v-col> </v-row
    ><!-- end ideas section -->
  </layout>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'

import UserProfileAvatar from './UserProfileAvatar'
import UserProfileAvatarCropDialog from './UserProfileAvatarCropDialog'
import Layout from '@/components/layout/Layout'
import updateProfileInfo from '@/graphql/mutations/updateProfileInfo'
import IdeasListIdea from '@/components/ideasList/ideasListIdea'
import VisualNotifier from '~/components/VisualNotifier'
import uploadAvatar from '~/graphql/mutations/uploadAvatar'

export default {
  name: 'UsersProfile',
  components: {
    UserProfileAvatar,
    IdeasListIdea,
    Layout,
    VisualNotifier,
    UserProfileAvatarCropDialog
  },
  $_veeValidate: {
    validator: 'new'
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
    },
    
    nameRules() {
      return [
        v => !!v || 'Name is required',
        v => (v && v.length > 3) || 'Name must be more than 3 characters'
      ]
    },
  },
  created() {
    this.profileData = this.initialProfileData
  },
  methods: {
    selectAvatar() {
      if (!this.isMyProfile) {
        return
      }
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
    enableEditMode() {
      this.editData.name = this.profileData.name
      this.editData.bio = this.profileData.bio
      this.editData.interestedInTags = this.profileData.interestedInTags
        ? this.profileData.interestedInTags.map(t => t)
        : []
      this.editMode = true
    },
    disableEditMode() {
      this.editMode = false
    },
    removeTag(item) {
      this.editData.interestedInTags.splice(
        this.editData.interestedInTags.indexOf(item),
        1
      )
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
        this.profileData.avatar = newAvatarUrl
        if (this.isMyProfile) {
          this.$store.commit('userData/updateUserAvatar', newAvatarUrl)
        }
        this.$refs.notifier.success('Avatar updated')
      } catch (e) {
        this.$refs.notifier.error('Error during avatar updating')
      }
      this.$store.commit('layoutState/hideProgressBar')
    },
    saveChanges() {
      setTimeout(async () => {
        try {
          this.savingChanges = true
          const resp = await this.$amplifyApi.graphql(
            graphqlOperation(updateProfileInfo, {
              bio: this.editData.bio,
              name: this.editData.name,
              interestedInTags: this.editData.interestedInTags
            })
          )

          if (resp.data.updateProfileInfo.result.ok) {
            this.profileData.bio = resp.data.updateProfileInfo.updatedInfo.bio
            this.profileData.name = resp.data.updateProfileInfo.updatedInfo.name
            this.profileData.slug = resp.data.updateProfileInfo.updatedInfo.slug
            this.profileData.interestedInTags =
              resp.data.updateProfileInfo.updatedInfo.interestedInTags
            this.editProfileInfoMode = false
            if (this.isMyProfile) {
              this.$store.commit(
                'userData/updateUserName',
                this.profileData.name
              )
              this.$store.commit(
                'userData/updateUserSlug',
                this.profileData.slug
              )
            }
            this.$refs.notifier.success('Profile Updated')
          } else {
            this.$refs.notifier.error(
              resp.data.updateProfileInfo.result.error ||
                'Cannot update profile'
            )
          }

          this.disableEditMode()
        } catch (err) {
          this.$refs.notifier.error('Cannot update profile')
        }
        this.savingChanges = false
      }, 10) // if last tag not saved yet editor needs time to process outer click event
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';

.profile-page {
  min-height: 100px;
}
.rxxow {
  border: 1px solid blue;
}

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
