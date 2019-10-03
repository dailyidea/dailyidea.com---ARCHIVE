export default `
query getIdea($ideaId: String!) {
  getIdea(ideaId: $ideaId) {
    ideaId
    content
    title
    createdDate
    ideaDate
    likesCount
    commentsCount
  }
}`
