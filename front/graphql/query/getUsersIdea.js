export default `
query getUsersIdea($userId: String!, $ideaId: String!) {
  getUsersIdea(userId: $userId, ideaId: $ideaId) {
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
}`
