export default `
query findIdeas($query: String) {
  findIdeas(query: $query) {
    items {
      userId
      authorAvatar
      ideaId
      shortId
      slug
      authorName
      strippedContent
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
