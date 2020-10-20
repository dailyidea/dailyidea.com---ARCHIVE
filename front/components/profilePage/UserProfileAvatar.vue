<template>
  <v-tooltip :disabled="!isMyProfile" right>
    <template v-slot:activator="{ on }">
      <div
        class="user-avatar__container"
        :class="{ 'with-avatar': userAvatar, changeable: isMyProfile }"
        :style="avatarStyle"
        @click="selectAvatar"
        v-on="on"
      ></div>
    </template>
    <span>Click to update your avatar</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'UserProfileAvatar',
  props: {
    profileData: { type: Object, required: true },
    isMyProfile: { type: Boolean }
  },

  computed: {
    userAvatar() {
      return this.profileData.avatar
    },

    avatarStyle() {
      return { 'background-image': `url(${this.userAvatar})` }
    }
  },

  methods: {
    selectAvatar() {
      this.$emit('select-avatar')
    }
  }
}
</script>

<style scoped lang="scss">
.user-avatar {
  &__container {
    display: flex;
    justify-content: center;
    background-size: cover;
    background-repeat: no-repeat;
    width: 150px;
    height: 150px;

    @media (max-width: $screen-md-max) {
      width: 100px;
      height: 100px;
    }

    border-radius: 50%;
    transition: background-color, opacity 0.2s ease;

    &.changeable {
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
