export default `
query ideas($order: IdeaSortingOrder, $nextToken: String, $limit: Int) {
  ideas(order: $order, nextToken: $nextToken, limit: $limit) {
    items {
      userId
      authorAvatar
      ideaId
      authorName
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
