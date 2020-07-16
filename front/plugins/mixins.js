import Vue from 'vue'

Vue.mixin({
  computed: {
    isMobile() {
      return !!navigator.share
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
