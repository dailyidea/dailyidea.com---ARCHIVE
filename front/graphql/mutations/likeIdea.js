export default `
mutation likeIdea( $ideaId: String! , $ideaOwnerId: String!) {
  likeIdea( ideaId: $ideaId, ideaOwnerId: $ideaOwnerId) {
    ideaId
  }
}`
