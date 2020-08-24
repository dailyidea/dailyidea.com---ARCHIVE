export const state = () => ({
  createdIdeaId: null
})

export const mutations = {
  UPDATE_CREATED(state, ideaId) {
    state.createdIdeaId = ideaId
  }
}
