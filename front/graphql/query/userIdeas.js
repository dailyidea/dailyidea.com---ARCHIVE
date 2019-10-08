export default `
query userIdeas($userId: String!, $nextToken: String, $limit: Int) {
  userIdeas(userId: $userId, nextToken: $nextToken, limit: $limit) {
    items {
      ideaId
      content
      title
      createdDate
      ideaDate
      likesCount
    }
    nextToken
  }
}`
