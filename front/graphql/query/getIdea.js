export default `
query getIdea($shortId: String!) {
  getIdea(shortId: $shortId) {
    ideaId
    userId
    shortId
    slug
    authorAvatar
    authorSlug
    authorName
    content
    title
    createdDate
    ideaDate
    savesCount
    likesCount
    commentsCount
    visibility
    fileAttachments
    imageAttachments
    previewImage
    viewsCount
  }
}`
