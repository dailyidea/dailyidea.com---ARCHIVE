export default `
query getMyIdea($ideaId: String!) {
  getMyIdea(ideaId: $ideaId) {
    ideaId
    userId
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
  }
}`
