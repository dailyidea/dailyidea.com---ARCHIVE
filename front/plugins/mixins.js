import Vue from 'vue'

Vue.mixin({
  methods: {
    $scrollToFirstError() {
      const field = this.$validator.errors.items[0].field
      this.$el
        .querySelector('[data-vv-name="' + field + '"]')
        .scrollIntoView({ block: 'center', inline: 'nearest' })
    }
  }
})
