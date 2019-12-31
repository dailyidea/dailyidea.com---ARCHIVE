export default `
mutation shareIdea( $ideaId: String! $ideaOwnerId: String! , $email: String!, $senderName: String!, $friendName: String!) {
  shareIdea( ideaId: $ideaId, ideaOwnerId: $ideaOwnerId, email: $email, senderName: $senderName, friendName: $friendName) {    
      ok
      error
  }
}`
