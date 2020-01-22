export default `
mutation addComment( $body: String!, $ideaOwnerId: String!, $ideaId: String!, $userName:String!, $userSlug: String!) {
  addComment( body: $body, ideaOwnerId: $ideaOwnerId, ideaId: $ideaId, userName:$userName, userSlug:$userSlug) {
    result {
      ok
    }
    comment {
      commentId
      body
      userId
      userName
      userSlug
      createdDate
    }
  }
}`
