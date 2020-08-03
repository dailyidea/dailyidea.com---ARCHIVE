<template>
  <span class="links d-flex flex-row align-center justify-space-between">
    <nuxt-link
      class="link"
      :class="{ active: page === 'explore' }"
      :to="{ name: 'ideas-all' }"
    >
      <img
        v-if="page === 'explore'"
        class="active-bulb"
        src="~/assets/images/navbar/bulb-active.svg"
      />
      <img v-else src="~/assets/images/navbar/bulb.svg" />
      <span class="link-text">
        <span class="text-shadow"></span>
        <span class="text">Explore</span>
      </span>
    </nuxt-link>
    <nuxt-link
      class="link"
      :class="{ active: page === 'post' }"
      :to="{ name: 'ideas-create' }"
    >
      <img
        v-if="page === 'post'"
        src="~/assets/images/navbar/post-active.svg"
      />
      <img v-else src="~/assets/images/navbar/post.svg" />
      <span class="link-text">
        <span class="text-shadow"></span>
        <span class="text">Post</span>
      </span>
    </nuxt-link>
    <nuxt-link
      class="link"
      :class="{ active: page === 'profile' }"
      :to="{ name: 'ideas-me' }"
    >
      <img
        v-if="page === 'profile'"
        src="~/assets/images/navbar/profile-active.svg"
      />
      <img v-else src="~/assets/images/navbar/profile.svg" />
      <span class="link-text">
        <span class="text-shadow"></span>
        <span class="text">My Ideas</span>
      </span>
    </nuxt-link>
  </span>
</template>

<script>
export default {
  name: 'Links',
  data() {
    return {
      pages: {
        '/ideas/all': 'explore',
        '/ideas/me': 'profile',
        '/ideas/create': 'post'
      }
    }
  },
  computed: {
    page() {
      return this.pages[this.$route.path]
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

  img {
    height: 20px;
    padding-right: 10px;
  }
}

.active {
  color: $primary-color;
  @media (min-width: $screen-md-min) {
    border-bottom: 3px solid $secondary-color;
  }

  height: 100%;
  .link-text {
    position: relative;
    .text-shadow {
      position: absolute;
      height: 50%;
      width: 100%;
      background-color: $primary-color;
      opacity: 0.2;
      bottom: 0;
    }
  }

  .active-bulb {
    height: 25px;
  }
}
</style>
