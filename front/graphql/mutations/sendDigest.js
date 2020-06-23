export default `
mutation sendDigest($ideaIds: [String]!, $passcode: String!) {
  sendDigest(ideaIds: $ideaIds, passcode: $passcode) {
      ok
      error
  }
}`
