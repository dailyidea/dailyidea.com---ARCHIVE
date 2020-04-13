export default `
mutation addIdeaTemporaryComment( $body: String!, $ideaName:String!, $ideaOwnerId: String!, $ideaId: String!, $userId: String!) {
  addIdeaTemporaryComment( body: $body, ideaName:$ideaName, ideaOwnerId: $ideaOwnerId, ideaId: $ideaId, userId: $userId) {
    result {
      ok
    }
    comment {
      commentId
      body
      userId
      createdDate
    }
  }
}`
