export default `
query getIdeaTemporaryComment($commentId: String!) {
  getIdeaTemporaryComment(commentId: $commentId) {
    result {
      ok
      error
    }
    comment {
      commentId
      body
    }
  }
}`
