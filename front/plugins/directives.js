import Vue from 'vue'

Vue.directive('focus', {
  inserted(el, binding, vnode) {
    setTimeout(() => {
      if (el.name === 'input' || el.name === 'textarea') {
        el.focus()
      } else {
        const editable = el.querySelector('[contenteditable=true]')
        if (editable) return editable.focus()

        const input = el.querySelector('input, textarea')
        if (input) return input.focus()
      }
    }, 50)
  }
})
