export default `
mutation addTags( $tags: [TagInput] ) {
  addTags( tags: $tags ) {
    ideaId
    tag
  }
}`
