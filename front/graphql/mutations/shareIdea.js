export default `
mutation shareIdea( $ideaId: String! , $email: String!) {
  shareIdea( ideaId: $ideaId, email: $email) {    
      ok
      error
  }
}`
