export default `
mutation createIdea($title: String!, $content: String, $tags: [String], $fileAttachments:[String], $imageAttachments:[String], $isPrivate: Boolean) {
  createIdea(title: $title, content: $content, tags: $tags, isPrivate: $isPrivate, fileAttachments: $fileAttachments, imageAttachments: $imageAttachments) {
    ideaId
  }
}`
