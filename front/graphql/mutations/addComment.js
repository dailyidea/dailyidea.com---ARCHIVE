export default `
mutation addComment( $body: String!, $userId: String!, $ideaId: String!, ) {
  addComment( body: $body, userId: $userId, ideaId: $ideaId ) {
    ideaId
    content
    title
    createdDate
    ideaDate
    comments {
      userId
      body
      commentId
    }
  }
}`
