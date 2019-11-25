export default `
mutation createIdea($title: String!, $content: String, $tags: [String], $isPrivate: Boolean) {
  createIdea(title: $title, content: $content, tags: $tags, isPrivate: $isPrivate) {
    ideaId
  }
}`
