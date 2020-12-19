export default `
query getPublicIdeas($order: IdeaSortingOrder, $nextToken: String, $topOption: String, $limit: Int) {
  getPublicIdeas(order: $order, nextToken: $nextToken, topOption: $topOption, limit: $limit) {
    items {
      ideaId
      userId
      shortId
      slug
      authorName
      authorAvatar
      authorSlug
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
