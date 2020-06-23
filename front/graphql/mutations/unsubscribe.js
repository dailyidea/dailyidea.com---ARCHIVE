export default `
mutation unsubscribe ($userId: String!, $token: String!) {
  unsubscribe (userId: $userId, token: $token) {
      ok
      error
      userName
  }
}`
