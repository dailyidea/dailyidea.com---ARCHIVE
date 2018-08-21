import Vue from 'vue'
import { RouterLinkStub, TransitionGroupStub } from '@vue/test-utils'
// eslint-disable-next-line no-unused-vars
import Mixins from '@/plugins/mixins'
Vue.config.productionTip = false
// TODO https://github.com/vuejs/vue-test-utils/issues/532
const nuxtLinkStub = {
  name: 'nuxt-link',
  functional: true,
  render(h, { data, children }) {
    return h('router-link', data, children)
  }
}

if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = () => {}
}
Vue.component('router-link', RouterLinkStub)
Vue.component('nuxt-link', nuxtLinkStub)
Vue.component('transition-group', TransitionGroupStub)
