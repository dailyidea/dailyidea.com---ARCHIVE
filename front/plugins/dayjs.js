import Vue from 'vue'
import dayjs from 'dayjs'

Vue.filter('dayjs', (value, method, ...params) => {
  let d = dayjs(value)
  if (!d.isValid()) return ''
  if (method) {
    return d[method].apply(d, params)
  }
})
