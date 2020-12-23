export const actions = {
  async nuxtServerInit(ctx) {
    // console.log('nuxtServerInit', ctx);
    try {
      await ctx.dispatch('cognito/fetchSession', { root: true })
      await ctx.commit('userData/setUserIsAuthenticated')
      await ctx.dispatch('userData/fetchUserData', {})
    } catch (e) {
      // no user logged in
    }
  }
}

export const state = () => ({
  routerLoading: false,
  routerLoadingEnabled: true
})

export const mutations = {
  SET_ROUTER_LOADING(state, enabled) {
    state.routerLoading = enabled
  },

  SET_ROUTER_LOADING_ENABLED(state, enabled) {
    state.routerLoadingEnabled = enabled
  }
}
