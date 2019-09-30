export default `
query getLikedIdeas($nextToken: String, $limit: Int) {
  getLikedIdeas(nextToken: $nextToken, limit: $limit) {
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
