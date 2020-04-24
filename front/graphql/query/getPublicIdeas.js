export default `
query getPublicIdeas($order: IdeaSortingOrder, $nextToken: String, $limit: Int) {
  getPublicIdeas(order: $order, nextToken: $nextToken, limit: $limit) {
    items {
      ideaId
      userId
      authorName
      authorAvatar
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
