export default `
query getUsersIdeas($userId: String!) {
  getUsersIdeas(userId: $userId) {
    items:{
      ideaId
      authorName
      content
      title
      createdDate
      ideaDate
      likesCount
      commentsCount
      visibility
    }
    nextToken: String
  }
}`
