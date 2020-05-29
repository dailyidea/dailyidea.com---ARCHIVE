export default `
mutation uploadAvatar( $avatar: String!, $isSVG: Boolean) {
  uploadAvatar( avatar: $avatar, isSVG: $isSVG) {
        result {
          ok
          error
        }
        avatar
  }
}`
