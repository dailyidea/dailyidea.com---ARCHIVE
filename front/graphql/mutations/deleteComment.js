export default `
mutation deleteComment($ideaId: String!, $ideaOwnerId: String!, $commentId: String! ) {
  deleteComment(ideaId: $ideaId, ideaOwnerId: $ideaOwnerId, commentId: $commentId ) {
    ok
    error
  }
}`
