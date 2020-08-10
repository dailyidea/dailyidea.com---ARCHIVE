import Vue from 'vue'

Vue.mixin({
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown
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
