export default `
mutation addTags( $tags: [TagInput] ) {
  addTags( $tags ) {
    ideaId
    tag
  }
}`
