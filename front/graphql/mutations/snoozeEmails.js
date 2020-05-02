export default `
mutation snoozeEmails( $userId: String!, $token: String!, $days: Int!) {
  snoozeEmails( userId: $userId, token: $token, days: $days) {    
      ok
      error
  }
}`
