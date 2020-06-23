export default `
mutation updateIdea($ideaId: String!, $ideaOwnerId: String!, $content: String!, $title: String!, $tags: [String!], $fileAttachments:[String], $imageAttachments:[String]) {
  updateIdea(ideaId: $ideaId, ideaOwnerId: $ideaOwnerId, content: $content, title: $title, tags: $tags, fileAttachments: $fileAttachments, imageAttachments: $imageAttachments) {
    result{
      ok
    }
    idea{
      ideaId
      slug
    }
  }
}`
