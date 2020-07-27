export default `
query getComments($ideaId: String!, $nextToken: String, $limit: Int) {
  getComments(ideaId: $ideaId, nextToken: $nextToken, limit: $limit) {
    items {
      commentId
      body
      userId
      userName
      userSlug
      userAvatar
      createdDate
    }
    nextToken
  }
}`
