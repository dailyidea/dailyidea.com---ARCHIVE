<template>
  <layout>
    <v-row no-gutters>
      <v-col>
        <div class="profile-page">
          <div class="profile-page__header">
            <v-tooltip top :disabled="!allowEdit">
              <template v-slot:activator="{ on }">
                <div
                  class="user-avatar__container"
                  :class="{ 'with-avatar': avatarIsSet, changeable: allowEdit }"
                  :style="avatarStyle"
                  @click="selectAvatar"
                  v-on="on"
                >
                  <span v-if="!avatarIsSet">
                    <v-icon>fas fa-user</v-icon>
                  </span>
                </div>
              </template>
              <span>Click to update your avatar</span>
            </v-tooltip>

            <!--            <v-btn icon height="60" width="60" color="#ebe7ed"><v-icon>fas fa-user</v-icon></v-btn>-->
            <div class="profile-page__header__username">
              <v-text-field
                v-if="editMode"
                v-model="editData.name"
                :disabled="savingChanges"
                maxlength="128"
                :rules="nameRules"
                class="username-edit"
                dense
                autofocus
                placeholder="Yor Name"
              ></v-text-field>
              <span
                v-else
                class="profile-page__header__username__name-container"
                >{{ profileData.name }}
                <v-tooltip v-if="allowEdit" top>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      class="profile-page__header__username__edit-icon"
                      :size="20"
                      color="info"
                      @click="enableEditMode"
                      v-on="on"
                      >mdi-pencil</v-icon
                    >
                  </template>
                  <span
                    >Click to update your name, bio, or interested in tags</span
                  >
                </v-tooltip>
              </span>
            </div>
            <div class="profile-page__header__counters">
              <v-row>
                <v-col>
                  <div class="profile-page__header__counters__counter">
                    <div class="profile-page__header__counters__counter__count">
                      {{ profileData.ideasCreated }}
                    </div>
                    <div class="profile-page__header__counters__counter__label">
                      ideas
                    </div>
                  </div>
                </v-col>
                <v-col>
                  <div class="profile-page__header__counters__counter">
                    <div class="profile-page__header__counters__counter__count">
                      {{ profileData.followersCount }}
                    </div>
                    <div class="profile-page__header__counters__counter__label">
                      followers
                    </div>
                  </div>
                </v-col>
                <v-col>
                  <div class="profile-page__header__counters__counter">
                    <div class="profile-page__header__counters__counter__count">
                      {{ profileData.followeesCount }}
                    </div>
                    <div class="profile-page__header__counters__counter__label">
                      following
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>
          <div class="profile-page__bio">
            <span v-if="!editMode">{{ profileData.bio }}</span>
            <v-textarea
              v-else
              v-model="editData.bio"
              :rows="3"
              maxlength="1000"
              :disabled="savingChanges"
              placeholder="Tell few words about yourself"
              style="margin-top: -10px; font-size: 18px;"
            ></v-textarea>
          </div>
          <div
            v-if="
              editMode ||
                (profileData.interestedInTags &&
                  profileData.interestedInTags.length)
            "
            class="profile-page__tags"
          >
            <div class="profile-page__tags__header">Interested in:</div>
            <div v-if="!editMode" class="profile-page__tags__tag">
              <v-chip
                v-for="(item, index) in profileData.interestedInTags"
                :key="index"
                label
                color="#6e6e6e"
                outlined
                style="font-weight: normal; margin-right: 7px"
                >{{ item }}
              </v-chip>
            </div>
            <div v-else class="profile-page__tags__tags-editor">
              <v-combobox
                v-model="editData.interestedInTags"
                placeholder="Add few tags about what are you interested in"
                :error-messages="errors.collect('tag')"
                data-vv-name="tag"
                hide-details
                times
                chips
                label=""
                multiple
                :disabled="savingChanges"
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    label
                    color="#6e6e6e"
                    outlined
                    style="font-weight: normal"
                    @click="() => {}"
                    @click:close="removeTag(item)"
                  >
                    {{ item }}
                  </v-chip>
                </template>
              </v-combobox>
            </div>
          </div>
          <div class="profile-page__ideas"></div>
          <div v-if="editMode" class="profile-page__edit-buttons">
            <v-btn text @click="disableEditMode">Cancel</v-btn>
            <v-btn :loading="savingChanges" @click="saveChanges">Save</v-btn>
          </div>
          <div v-if="ideas.length" class="profile-page__ideas">
            <div class="profile-page__ideas__header">
              {{ isMyProfile ? 'My' : `${profileData.name}'s` }} Ideas:
            </div>
            <div class="profile-page__ideas__container">
              <ideas-list-idea
                v-for="idea in ideas"
                :key="idea.ideaId"
                :idea="idea"
              ></ideas-list-idea>
            </div>
            <div
              v-if="loadMoreIdeasIsPossible"
              class="profile-page__ideas__load-more-panel"
            >
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
                <v-btn dark
                  >View all
                  {{ isMyProfile ? 'My' : `${profileData.name}'s` }}
                  Ideas</v-btn
                >
              </router-link>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
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
  </layout>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'

import UserProfileAvatarCropDialog from './UserProfileAvatarCropDialog'
import Layout from '@/components/layout/Layout'
import updateProfileInfo from '@/graphql/mutations/updateProfileInfo'
import IdeasListIdea from '@/components/ideasList/ideasListIdea'
import VisualNotifier from '~/components/VisualNotifier'
import uploadAvatar from '~/graphql/mutations/uploadAvatar'

export default {
  name: 'UsersProfile',
  components: {
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
    allowEdit() {
      return this.isMyProfile
    },
    nameRules() {
      return [
        v => !!v || 'Name is required',
        v => (v && v.length > 3) || 'Name must be more than 3 characters'
      ]
    },
    avatarIsSet() {
      return !!this.profileData.avatar
    },
    avatarStyle() {
      if (this.avatarIsSet) {
        return {
          'background-image': `url(${this.profileData.avatar})`
        }
      } else {
        return {}
      }
    }
  },
  created() {
    this.profileData = this.initialProfileData
  },
  methods: {
    selectAvatar() {
      if (!this.allowEdit) {
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
      this.editData.interestedInTags = this.profileData.interestedInTags.map(
        t => t
      )
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
  @include pageMargin;
  /*background-color: #c7d28e;*/
  min-height: 100px;

  &__header {
    text-align: center;

    &__username {
      font-size: 22px;
      color: #4a4a4a;
      font-weight: bolder;
      min-height: 60px;
      padding-top: 4px;

      &__name-container {
        position: relative;
        display: inline-block;
      }

      &__edit-icon {
        position: absolute;
        right: -25px;
        bottom: 7px;
        transition: opacity 0.2s ease;

        &:hover {
          opacity: 0.7;
        }
      }
    }

    &__counters {
      padding: 10px 0;
      border-bottom: 1px solid #eaeaea;

      &__counter {
        &__count {
          font-size: 22px;
          color: #4a4a4a;
          font-weight: bolder;
        }

        &__label {
          font-size: 16px;
          color: #b0b0b0;
        }
      }
    }
  }

  &__bio {
    margin-top: 10px;
    padding-top: 10px;
    color: #4a4a4a;
    line-height: 1.5;
    font-size: 18px;
    min-height: 100px;
  }

  &__edit-buttons {
    margin-top: 10px;
    text-align: right;
  }

  &__tags {
    &__header {
      font-size: 18px;
    }

    &__tag {
      margin-top: 20px;
    }

    &__tags-editor {
      ::v-deep .v-input__icon {
        display: none;
      }
    }
  }

  &__ideas {
    margin-top: 10px;

    &__header {
      font-size: 18px;
      margin-bottom: 20px;
    }

    &__load-more-panel {
      margin-top: 10px;
      text-align: center;
    }
  }
}

.user-avatar {
  &__container {
    background-size: cover;
    background-repeat: no-repeat;

    line-height: 60px;
    text-align: center;
    display: inline-block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    /*border: solid 1px black;*/
    background-color: #ebe7ed;
    transition: background-color, opacity 0.2s ease;

    &.changeable {
      cursor: pointer;

      &:not(.with-avatar) {
        &:hover {
          background-color: #dcd8de;
        }
      }

      &.with-avatar {
        &:hover {
          opacity: 0.8;
        }
      }

      &:active {
        background-color: #d3cfd5;
      }
    }
  }
}
</style>
