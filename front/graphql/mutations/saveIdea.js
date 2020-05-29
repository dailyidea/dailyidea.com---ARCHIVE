export default `
mutation saveIdea( $ideaId: String! , $ideaOwnerId: String!) {
  saveIdea( ideaId: $ideaId, ideaOwnerId: $ideaOwnerId) {
    result {
      ok
      error
    }
  }
}`
