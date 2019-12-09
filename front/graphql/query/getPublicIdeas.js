export default `
query getPublicIdeas($nextToken: String, $limit: Int) {
  getPublicIdeas(nextToken: $nextToken, limit: $limit) {
    items {
      ideaId
      authorName
      content
      title
      createdDate
      ideaDate
      likesCount
      commentsCount
      userId
    }
    nextToken
  }
}`
