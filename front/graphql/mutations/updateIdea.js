export default `
mutation updateIdea($ideaId: String!, $ideaOwnerId: String!, $content: String!, $title: String!, $tags: [String!]) {
  updateIdea(ideaId: $ideaId, ideaOwnerId: $ideaOwnerId, content: $content, title: $title, tags: $tags) {
    result{
      ok
    }
    idea{
      ideaId
    }
  }
}`
