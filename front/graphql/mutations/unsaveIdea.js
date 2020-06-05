export default `
mutation unsaveIdea( $ideaId: String! ) {
  unsaveIdea( ideaId: $ideaId) {
    result {
      ok
      error
    }
  }
}`
