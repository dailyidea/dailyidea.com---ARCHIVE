<template>
  <span ref="container">
    <slot />
    <span class="slider"></span>
  </span>
</template>

<script>
export default {
  props: {
    paddingLeft: { type: Number, default: 0 },
    paddingRight: { type: Number, default: 0 }
  },

  mounted() {
    this.$nextTick(() => {
      this.initSlider()
    })
  },

  methods: {
    setSliderToActive(slider) {
      if (!this.$refs.container) {
        return
      }
      const active = this.$refs.container.querySelector('.link.active')
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

      slider.style.width = `${width - this.paddingRight}px`
      slider.style.left = `${left + this.paddingLeft}px`
      slider.style.top = `${top + height}px`
    },

    initSlider() {
      const that = this
      const slider = this.$refs.container.querySelector('.slider')
      const links = this.$refs.container.querySelectorAll('.link')
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
        if (!this.$refs.container) {
          return
        }
        const active = this.$refs.container.querySelector('.link.highlight')
        if (active) {
          this.setSliderToEl(slider, active)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.slider {
  position: absolute;
  transition: all 0.35s ease-in-out;
  border-bottom: 3px solid $secondary-color;
}
</style>
