export default `
query getSavedIdeas($nextToken: String, $limit: Int) {
  getSavedIdeas(nextToken: $nextToken, limit: $limit) {
    items {
      ideaId
      authorAvatar
      authorName
      authorSlug
      userId
      content
      title
      createdDate
      ideaDate
      likesCount
      savesCount
      commentsCount
      }
    nextToken
  }
}`
