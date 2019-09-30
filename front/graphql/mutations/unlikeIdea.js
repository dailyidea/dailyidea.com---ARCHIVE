export default `
mutation unlikeIdea( $ideaId: String! ) {
  unlikeIdea( ideaId: $ideaId) {
    result {
      ok
      error
    }
    likesCount
  }
}`
