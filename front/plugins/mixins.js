import Vue from 'vue'

Vue.mixin({
  computed: {
    isMobile() {
      try {
        return !!navigator.share || this.$vuetify.breakpoint.smAndDown
      } catch(e) {
        return false;
      }
    }
  },
  methods: {
    $scrollToFirstError() {
      const field = this.$validator.errors.items[0].field
      this.$el
        .querySelector('[data-vv-name="' + field + '"]')
        .scrollIntoView({ block: 'center', inline: 'nearest' })
    }
  }
})
