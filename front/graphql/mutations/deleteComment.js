export default `
mutation deleteComment( $body: String!, $userId: String!, $ideaId: String!,$commentId: String! ) {
  deleteComment( body: $body, userId: $userId, ideaId: $ideaId, commentId: $commentId ) {
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
