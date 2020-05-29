export default `
query getIsIdeaSavedByMe($ideaId: String!) {
  getIsIdeaSavedByMe(ideaId: $ideaId) {
    result {
    ok
    }
    isSaved
  }
}`
