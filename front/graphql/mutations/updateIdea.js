export default `
mutation updateIdea($ideaId: String!, $ideaOwnerId: String!, $content: String!, $isPrivate: Boolean, $title: String!, $tags: [String!], $fileAttachments:[String], $imageAttachments:[String]) {
  updateIdea(ideaId: $ideaId, ideaOwnerId: $ideaOwnerId, content: $content, isPrivate: $isPrivate, title: $title, tags: $tags, fileAttachments: $fileAttachments, imageAttachments: $imageAttachments) {
    result{
      ok
    }
    idea{
      ideaId
      slug
    }
  }
}`
