export default `
mutation setWasWelcomed( $userId: String!) {
  setWasWelcomed( userId: $userId) {
    ok
    error
  }
}`
