export default `
mutation shareIdea( $ideaId: String! $ideaOwnerId: String! , $email: String!) {
  shareIdea( ideaId: $ideaId, ideaOwnerId: $ideaOwnerId, email: $email) {    
      ok
      error
  }
}`
