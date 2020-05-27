export default `
mutation deleteIdeaTemporaryComment($commentId: String! ) {
  deleteIdeaTemporaryComment(commentId: $commentId ) {
    ok
    error
  }
}`
