export default `
query getMyIdea($ideaId: String!) {
  getMyIdea(ideaId: $ideaId) {
    ideaId
    userId
    authorName
    authorSlug
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
