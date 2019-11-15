import Vue from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)

Vue.filter('toRelativeDate', (value) => {
  return dayjs(
    value.substr(0, 19) + '+0000',
    'YYYY-MM-DDTHH:mm:ssZ'
  ).fromNow()
})
