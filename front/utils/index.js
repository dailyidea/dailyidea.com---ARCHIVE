export const getErrorMessage = e => {
  let err
  if (e.response && e.response.data && e.response.data.message) {
    err = e.response.data.message
  } else {
    err = e
  }
  return err
}

export function insertQueryParam(key, value) {
  key = encodeURIComponent(key)
  value = encodeURIComponent(value)

  // kvp looks like ['key1=value1', 'key2=value2', ...]
  const kvp = document.location.search.substr(1).split('&')
  let i = 0

  for (; i < kvp.length; i++) {
    if (kvp[i].startsWith(key)) {
      const pair = kvp[i].split('=')
      if (pair.length > 1) {
        pair[1] = value
        kvp[i] = pair.join('=')
      }
      break
    }
  }

  if (i >= kvp.length) {
    kvp[kvp.length] = value !== 'undefined' ? `${key}=${value}` : key
  }

  window.history.replaceState(window.history.state, null, '?' + kvp.join('&'))
}

export function removeQueryParam(key) {
  // kvp looks like ['key1=value1', 'key2=value2', ...]
  const kvp = document.location.search.substr(1).split('&')
  let i = 0

  for (; i < kvp.length; i++) {
    if (kvp[i].startsWith(key)) {
      kvp.splice(i, 1)
      break
    }
  }

  // if (i < kvp.length) {
  //   kvp[kvp.length] = value !== 'undefined' ? `${key}=${value}` : key
  // }

  window.history.replaceState(window.history.state, null, '?' + kvp.join('&'))
}
