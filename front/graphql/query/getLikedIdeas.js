export default `
query getLikedIdeas($nextToken: String, $limit: Int) {
  getLikedIdeas(nextToken: $nextToken, limit: $limit) {
    items {
      ideaId
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
