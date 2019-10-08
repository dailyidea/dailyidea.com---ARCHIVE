export default `
mutation followUser( $userId: String! ) {
  followUser( userId: $userId ) {
    ok
    error
  }
}`
