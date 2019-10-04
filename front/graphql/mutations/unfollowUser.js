export default `
mutation unfollowUser( $userId: String! ) {
  unfollowUser( userId: $userId ) {
    ok
    error
  }
}`
