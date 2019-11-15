export default `
query ideas($nextToken: String, $limit: Int) {
  ideas(nextToken: $nextToken, limit: $limit) {
    items {
      userId
      ideaId
      content
      title
      createdDate
      ideaDate
      likesCount
      commentsCount
    }
    nextToken
  }
}`
