export default `
query getUsersIdeas($authorSlug: String!, $nextToken: String, $limit: Int) {
  getUsersIdeas(authorSlug: $authorSlug, nextToken: $nextToken, limit: $limit) {
    items {
      ideaId
      userId
      shortId
      slug
      authorName
      authorSlug
      content
      title
      createdDate
      ideaDate
      likesCount
      commentsCount
      visibility
    }
    nextToken
  }
}`
