export default `
query getLikedIdeas($nextToken: String, $limit: Int) {
  getLikedIdeas(nextToken: $nextToken, limit: $limit) {
    items {
      ideaId
      authorName
      authorSlug
      userId
      content
      title
      createdDate
      ideaDate
      likesCount
      }
    nextToken
  }
}`
