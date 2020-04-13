export default `
query checkEmailBelongsToExistingUser($email: String!) {
  checkEmailBelongsToExistingUser(email: $email) {
    belongsToExistingUser 
    userId
  }
}`
