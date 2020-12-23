import Vue from 'vue'

/*
 * This to disable global loading on specific navigations from to - page
 */

const disabledPages = [{ from: '/profile/.*', to: '/profile/.*' }]

Vue.mixin({
  beforeRouteLeave(to, from, next) {
    if (
      disabledPages.find(p => {
        return (
          new RegExp(p.to).test(to.path) && new RegExp(p.from).test(from.path)
        )
      })
    ) {
      this.$store.commit('SET_ROUTER_LOADING_ENABLED', false)
    }
    next()
  }
})
