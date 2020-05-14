export default {
  name: 'avatar',

  data() {
    return {
      avatarUrl:"https://avatars.dicebear.com/v2/human/botts.svg", 
    }
  },

  computed: {
    userAvatar() {
      return this.$store.getters['userData/avatar'];
    },

    avatar() {
      if(this.userAvatar) {
        return this.userAvatar;
      } else {
        return this.profileData.avatar;
      }
    },

    avatarIsSet() {
      if(this.profileData) {
        return !!this.profileData.avatar
      } else if(this.userAvatar) {
        return true;
      }

      return false;
    },

    avatarStyle() {
      if (this.avatarIsSet) {
        return {
          'background-image': `url(${this.avatar})`
        }
      } else {
        return {
          'background-image': `url(${this.avatarUrl})`
        }
      }
    }
  }
}
