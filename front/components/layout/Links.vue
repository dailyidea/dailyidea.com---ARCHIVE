<template>
  <span class="links d-flex flex-row align-center justify-space-between">
    <nuxt-link
      class="link"
      :class="{ active: page === 'explore' }"
      :to="{ name: 'ideas-all' }"
    >
      <bulb-icon
        v-if="page !== 'explore'"
        :fill="inactiveColor"
        class="img"
      ></bulb-icon>
      <bulb-on-icon
        v-else
        :fill="activeColor"
        class="active-bulb"
      ></bulb-on-icon>

      <link-text :active="page === 'explore'" text="Explore"></link-text>
    </nuxt-link>
    <nuxt-link
      class="link"
      :class="{ active: page === 'post' }"
      :to="{ name: 'ideas-create' }"
    >
      <post-icon
        :stroke="page !== 'post' ? inactiveColor : activeColor"
        :fill="page !== 'post' ? inactiveColor : activeColor"
        class="img"
      ></post-icon>

      <link-text :active="page === 'post'" text="Post"></link-text>
    </nuxt-link>
    <nuxt-link
      class="link"
      :class="{ active: page === 'profile' }"
      :to="{ name: 'ideas-me' }"
    >
      <profile-icon
        :fill="page !== 'profile' ? inactiveColor : activeColor"
        class="img"
      ></profile-icon>

      <link-text :active="page === 'profile'" text="My Ideas"></link-text>
    </nuxt-link>
  </span>
</template>

<script>
import ProfileIcon from './svgIcons/ProfileIcon.vue'
import PostIcon from './svgIcons/PostIcon.vue'
import BulbIcon from './svgIcons/BulbIcon.vue'
import BulbOnIcon from './svgIcons/BulbOnIcon.vue'
import LinkText from './LinkText.vue'

export default {
  name: 'Links',
  components: {
    ProfileIcon,
    PostIcon,
    BulbIcon,
    BulbOnIcon,
    LinkText
  },
  data() {
    return {
      activeColor: '#ffc61e',
      inactiveColor: '#151125',
      pages: {
        'i-shortId-slug': 'explore',
        'ideas-all': 'explore',
        'ideas-me': 'profile',
        profile: 'profile',
        'ideas-saved': 'profile',
        'ideas-create': 'post'
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
  cursor: pointer;
  text-decoration: none;
  color: black;
  display: flex;
  align-items: center;
  @media (min-width: $screen-md-min) {
    padding: 1.1rem;
  }

  @media (max-width: $screen-sm-max) {
    flex-direction: column;
  }

  .img {
    height: 20px;
    width: 40px;
    @media (min-width: $screen-md-min) {
      padding-right: 15px;
    }
  }
}

.active {
  @media (min-width: $screen-md-min) {
    border-bottom: 3px solid $secondary-color;
  }

  height: 100%;

  .active-bulb {
    height: 30px;

    @media (min-width: $screen-md-min) {
      padding-right: 9px;
      padding-bottom: 3px;
    }

    @media (max-width: $screen-sm-max) {
      /* Prevent image from offsetting itself due to light rays */
      margin-top: -10px;
    }
  }
}
</style>
