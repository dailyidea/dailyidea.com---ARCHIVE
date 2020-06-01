export default `
query getIdea($ideaId: String!) {
  getIdea(ideaId: $ideaId) {
    ideaId
    shortId
    slug
    content
    title
    createdDate
    ideaDate
    likesCount
    userId
    commentsCount
  }
}`
