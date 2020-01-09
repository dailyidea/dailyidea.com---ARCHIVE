export default `
query getPublicIdeas($nextToken: String, $limit: Int) {
  getPublicIdeas(nextToken: $nextToken, limit: $limit) {
    items {
      ideaId
      userId
      authorName
      authorSlug
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
