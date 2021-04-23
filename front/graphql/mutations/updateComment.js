export default `
mutation updateComment( $body: String!, $ideaId: String!, $commentId: String!) {
  updateComment( body: $body, ideaId: $ideaId, commentId: $commentId) {
    result {
      ok
    }
    comment {
      commentId
      ideaId
      body
      userId
      userName
      userSlug
      createdDate
    }
  }
}`
