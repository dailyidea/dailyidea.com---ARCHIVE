window.fbAsyncInit = function () {
  // eslint-disable-next-line
  FB.init({
    xfbml: true,
    version: 'v6.0'
  })
}
;(function (d, s, id) {
  // eslint-disable-next-line
  var js,
    fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) return
  js = d.createElement(s)
  js.id = id
  js.src =
    'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js'
  fjs.parentNode.insertBefore(js, fjs)
})(document, 'script', 'facebook-jssdk')
