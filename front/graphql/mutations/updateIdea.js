export default `
mutation updateIdea($ideaId: String!, $content: String!, $title: String!) {
  updateIdea(ideaId: $ideaId, content: $content, title: $title) {
    ideaId
  }
}`
