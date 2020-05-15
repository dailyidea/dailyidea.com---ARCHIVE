export default {
  name: 'avatar',

  data() {
    return {
      baseBotttsURL:"https://avatars.dicebear.com/api/bottts/", 
    }
  },

  computed: {
    userId() {
      return this.$store.getters['userData/userId'];
    },

    defaultAvatar() {
      return this.baseBotttsURL + `${this.userId}.svg`;
    },

    userAvatar() {
      return this.$store.getters['userData/avatar'];
    },

    avatar() {
      if(this.userAvatar) {
        return this.userAvatar;
      } else {
        return this.defaultAvatar;
      }
    },

    avatarStyle() {
      return {
        'background-image': `url(${this.avatar})`
      }
    }
  }
}
