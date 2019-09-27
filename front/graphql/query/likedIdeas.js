export default `
query likedIdeas($userId: String!) {
  likedIdeas(userId: $userId) {
    items {
      ideaId
      content
      title
      createdDate
      ideaDate
      }
  }
}`
