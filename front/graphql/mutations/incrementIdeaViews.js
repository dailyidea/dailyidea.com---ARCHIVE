export default `
mutation incrementIdeaViews( $ideaId: String!, $ideaOwnerId: String!) {
  incrementIdeaViews( ideaId: $ideaId, ideaOwnerId: $ideaOwnerId) {
    ok
    error
  }
  viewsCount
}`
