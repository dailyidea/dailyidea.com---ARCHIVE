export default `
mutation deleteTag( $tag: TagInput ) {
  deleteTag(tag: $tag) {
    tag
  }
}`
