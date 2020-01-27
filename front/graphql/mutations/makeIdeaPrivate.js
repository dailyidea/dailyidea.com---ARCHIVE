export default `
mutation makeIdeaPrivate( $ideaId: String!) {
  makeIdeaPrivate( ideaId: $ideaId) {
    ok
    error
  }
}`
