export default `
mutation addComment( $body: String!, $ideaOwnerId: String!, $ideaId: String!, ) {
  addComment( body: $body, ideaOwnerId: $ideaOwnerId, ideaId: $ideaId ) {
    result {
      ok
    }
    comment {
      commentId
      body
    }
  }
}`
