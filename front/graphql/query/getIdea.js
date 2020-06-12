export default `
query getIdea($shortId: String!) {
  getIdea(shortId: $shortId) {
    ideaId
    userId
    shortId
    slug
    authorSlug
    authorName
    content
    title
    createdDate
    ideaDate
    likesCount
    commentsCount
    visibility
    fileAttachments
    imageAttachments
    previewImage
    viewsCount
  }
}`
