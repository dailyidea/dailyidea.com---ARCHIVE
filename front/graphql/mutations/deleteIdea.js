export default `
mutation deleteIdea($ideaId: String!) {
  deleteIdea(ideaId: $ideaId) {
    ideaId
  }
}`
