export const state = () => ({
  progressBarActive: false
})

export const mutations = {
  showProgressBar(state, data) {
    state.progressBarActive = true
  },
  hideProgressBar(state, data) {
    state.progressBarActive = false
  }
}

export const actions = {}

export const getters = {
  progressBarActive(state) {
    return state.progressBarActive
  }
}
