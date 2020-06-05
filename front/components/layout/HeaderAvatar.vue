<template>
  <span class="mb-2 userAvatarContainer" :style="avatarStyle"></span>
</template>

<script>
export default {
  name: 'HeaderAvatar',
  computed: {
    userAvatar() {
      return this.$store.getters['userData/avatar']
    },

    avatarStyle() {
      return {
        'background-image': `url(${this.userAvatar})`
      }
    }
  }
}
</script>

<style scoped lang="scss">
.userAvatarContainer {
  display: inline-block;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  vertical-align: middle;
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.8;
  }
}
</style>
