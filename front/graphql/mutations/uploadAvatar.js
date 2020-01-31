export default `
mutation uploadAvatar( $avatar: String!) {
  uploadAvatar( avatar: $avatar) {
        result {
          ok
          error
        }
        avatar
  }
}`
