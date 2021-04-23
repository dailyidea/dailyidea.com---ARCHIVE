import Vue from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)

Vue.filter('toRelativeDate', value => {
  if (!value) {
    return ''
  }
  return dayjs(value.substr(0, 19) + '+0000', 'YYYY-MM-DDTHH:mm:ssZ').fromNow()
})

Vue.filter(
  'numberFormat',
  (number, decimals, decPoint = '.', thousandsPoint = ',') => {
    if (number == null || !isFinite(number)) {
      throw new TypeError('number is not valid')
    }

    if (!decimals) {
      const len = number.toString().split('.').length
      decimals = len > 1 ? len : 0
    }

    number = parseFloat(number).toFixed(decimals)
    number = number.replace('.', decPoint)

    const splitNum = number.split(decPoint)
    splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsPoint)
    number = splitNum.join(decPoint)

    return number
  }
)
