export const actions = {
  async nuxtServerInit(ctx) {
    await ctx.dispatch('cognito/fetchSession', { root: true })
  }
}

export const state = () => {}

export const mutations = {}
