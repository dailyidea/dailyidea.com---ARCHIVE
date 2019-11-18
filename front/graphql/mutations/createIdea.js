export default `
mutation createIdea($title: String!, $content: String) {
  createIdea(title: $title, content: $content) {
    ideaId
  }
}`
