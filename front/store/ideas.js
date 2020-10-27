export const state = () => ({
  createdIdeaId: null,
  cachedIdeas: {}
})

export const getters = {
  cachedIdeas(state) {
    return state.cachedIdeas
  }
}

export const mutations = {
  UPDATE_CREATED(state, ideaId) {
    state.createdIdeaId = ideaId
  },

  setCachedIdeas(state, ideaObject) {
    state.cachedIdeas[ideaObject.category] = ideaObject.ideas
  },

  resetCachedIdeas(state) {
    state.cachedIdeas = {}
  }
}
