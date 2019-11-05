export default `
mutation toggleIdeaVisibility($ideaOwnerId: String!, $ideaId: String!,  $state: IdeaVisibilityState! ) {
  toggleIdeaVisibility( ideaOwnerId: $ideaOwnerId, ideaId: $ideaId, state: $state ) {    
    state
  }
}`
