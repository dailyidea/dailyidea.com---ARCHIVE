export const actions = {
  async nuxtServerInit(ctx) {
    try {
      await ctx.dispatch('cognito/fetchSession', { root: true })
    } catch (e) {
      // no user logged in
    }
  }
}

export const state = () => {}

export const mutations = {}
