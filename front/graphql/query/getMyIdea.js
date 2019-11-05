export default `
query getMyIdea($ideaId: String!) {
  getMyIdea(ideaId: $ideaId) {
    ideaId
    content
    title
    createdDate
    ideaDate
    likesCount
    commentsCount
    visibility
  }
}`
