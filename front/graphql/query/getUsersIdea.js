export default `
query getUsersIdea($userId: String!, $ideaId: String!) {
  getUsersIdea(userId: $userId, ideaId: $ideaId) {
    ideaId
    content
    title
    createdDate
    ideaDate
    likesCount
    commentsCount
  }
}`
