import Vue from 'vue'
import AppDialog from '@/components/dialogs/AppDialog'

const Dialog = {
  install(Vue, options) {
    this.eventBus = new Vue()

    Vue.component('app-dialog', AppDialog)

    Vue.prototype.$dialog = {
      show(params) {
        return new Promise((resolve, reject) => {
          Dialog.eventBus.$emit('show', params, resolve)
        })
      }
    }
  }
}

Vue.use(Dialog)

export default Dialog
