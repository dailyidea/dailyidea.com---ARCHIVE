<template>
  <span class="links d-flex flex-row align-center justify-space-between">
    <nuxt-link
      class="link"
      :class="{ active: page === 'explore' }"
      to="/ideas-cards"
    >
      <bulb-icon v-if="page !== 'explore'" :fill="inactiveColor" class="img" />
      <bulb-on-icon v-else :fill="activeColor" class="active-bulb" />
      <span :class="{ 'link-highlight': page === 'explore' }">Explore</span>
    </nuxt-link>
    <nuxt-link
      class="link"
      :class="{ active: page === 'post', disabled: !slug }"
      :to="{ name: 'ideas-create' }"
    >
      <post-icon
        :stroke="iconColor('post')"
        :fill="iconColor('post')"
        class="img"
      />
      <span :class="{ 'link-highlight': page === 'post' }">Post</span>
    </nuxt-link>
    <nuxt-link
      class="link"
      :class="{ active: page === 'profile', disabled: !slug }"
      :to="slug ? `/profile/${slug}` : '/auth/unathorized'"
    >
      <profile-icon :fill="iconColor('profile')" class="img" />
      <span :class="{ 'link-highlight': page === 'profile' }">My Ideas</span>
    </nuxt-link>
    <span class="slider"></span>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
import ProfileIcon from './svgIcons/ProfileIcon.vue'
import PostIcon from './svgIcons/PostIcon.vue'
import BulbIcon from './svgIcons/BulbIcon.vue'
import BulbOnIcon from './svgIcons/BulbOnIcon.vue'

export default {
  name: 'Links',

  components: {
    ProfileIcon,
    PostIcon,
    BulbIcon,
    BulbOnIcon
  },

  data() {
    return {
      activeColor: '#ffc61e',
      inactiveColor: '#151125',
      disabledColor: '#acabb2',
      pages: {
        'i-shortId-slug': 'explore',
        'ideas-all': 'explore',
        'ideas-me': 'profile',
        profile: 'profile',
        'profile-userSlug-saved': 'profile',
        'profile-userSlug': 'profile',
        'ideas-saved': 'profile',
        'ideas-create': 'post',
        'profile-edit': 'profile'
      }
    }
  },

  computed: {
    ...mapGetters({
      slug: 'userData/slug'
    }),

    page() {
      const pageOn = this.pages[this.$route.name]

      if (pageOn === 'profile' && this.$route.params.userSlug !== this.slug) {
        return null
      }

      return pageOn
    }
  },

  mounted() {
    this.initSlider()
  },

  methods: {
    iconColor(page) {
      return this.slug
        ? this.page !== page
          ? this.inactiveColor
          : this.activeColor
        : this.disabledColor
    },

    setSliderToActive(slider) {
      const active = document.querySelector('.links a.active')
      if (active) {
        this.setSliderToEl(slider, active)
        active.classList.add('highlight')
      }
    },

    setSliderToEl(slider, el) {
      const width = el.getBoundingClientRect().width
      const height = el.getBoundingClientRect().height
      const left = el.getBoundingClientRect().left + window.pageXOffset
      const top = el.getBoundingClientRect().top + window.pageYOffset

      slider.style.width = `${width - 30}px`
      slider.style.left = `${left + 20}px`
      slider.style.top = `${top + height}px`
    },

    initSlider() {
      const that = this
      const slider = document.querySelector('.slider')
      const links = document.querySelectorAll('.links a')
      this.$nextTick(() => this.setSliderToActive(slider))

      function handleMouseenter() {
        for (let i = 0; i < links.length; i++) {
          if (links[i].classList.contains('highlight')) {
            links[i].classList.remove('highlight')
          }
        }
        this.classList.add('highlight')
        that.setSliderToEl(slider, this)
      }

      for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('mouseenter', handleMouseenter)
        links[i].addEventListener('mouseleave', () => {
          this.setSliderToActive(slider)
        })
      }

      window.addEventListener('resize', () => {
        const active = document.querySelector('.links a.highlight')
        if (active) {
          this.setSliderToEl(slider, active)
        }
      })
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
  > span {
    margin-top: 0.2em;
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
  height: 100%;

  .active-bulb {
    height: 30px;
    margin: -2px 0;

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

.slider {
  position: absolute;
  z-index: -1;
  transition: all 0.35s ease-in-out;
  border-bottom: 3px solid $secondary-color;
}
</style>
