export default `
query getPublicIdeas($nextToken: String, $limit: Int) {
  getPublicIdeas(nextToken: $nextToken, limit: $limit) {
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
