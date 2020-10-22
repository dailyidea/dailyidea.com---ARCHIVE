import Vue from 'vue'
import AppNotifier from '@/components/layout/AppNotifier'

const Notifier = {
  install(Vue, options) {
    this.eventBus = new Vue()

    Vue.component('app-notifier', AppNotifier)

    Vue.prototype.$notifier = {
      show(params) {
        Notifier.eventBus.$emit('show', params)
      },
      success(params) {
        Notifier.eventBus.$emit('success', params)
      },
      error(params) {
        Notifier.eventBus.$emit('error', params)
      }
    }
  }
}

Vue.use(Notifier)

export default Notifier
