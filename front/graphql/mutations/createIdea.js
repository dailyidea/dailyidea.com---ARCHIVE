export default `
mutation createIdea( $content: String!, $title: String!) {
  createIdea( content: $content, title: $title) {
    ideaId
  }
}`
