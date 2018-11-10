export default `
mutation requestLogin($email: String!) {
  requestLogin(email: $email) {
    ok
    error
  }
}`
