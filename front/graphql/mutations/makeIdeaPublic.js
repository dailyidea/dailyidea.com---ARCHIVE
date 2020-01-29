export default `
mutation makeIdeaPublic( $ideaId: String!) {
  makeIdeaPublic( ideaId: $ideaId) {
    ok
    error
  }
}`
