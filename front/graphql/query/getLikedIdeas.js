export default `
query getLikedIdeas {
  ideas {
    items {
      ideaId
      content
      title
      createdDate
      ideaDate
    }
  }
}`
