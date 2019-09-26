export default `
query getIdeaTags($ideaId: String!) {
  ideaTags(ideaId: $ideaId) {
    tag
  }
}`
