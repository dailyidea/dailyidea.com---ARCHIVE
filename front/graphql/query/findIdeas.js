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
