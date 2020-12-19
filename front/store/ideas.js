import merge from 'lodash/merge'
import uniqBy from 'lodash/uniqBy'
import getIdea from '@/graphql/query/getIdea'
import loadIdeas from '@/helpers/load-ideas'
import getPublicIdeasForQueue from '@/graphql/query/getPublicIdeasForQueue'
import { ORDER } from '@/helpers/ideas-ordering'

const categoriesOrders = {
  new: ORDER.DATE_DESC,
  top: ORDER.LIKES
}

const queueData = {
  category: 'new',
  loading: false,
  ideas: [],
  currIndex: 0,
  nextToken: null
}

export const state = () => ({
  createdIdeaId: null,
  currCategory: 'new',
  topOption: 'all',

  ideasQueues: {
    top: merge({}, queueData),
    new: merge({}, queueData)
  }
})

export const actions = {
  async getIdea({ commit, getters }, { app, shortId }) {
    try {
      commit('GET_IDEA')
      const { data } = await app.$amplifyApi.graphql({
        query: getIdea,
        variables: { shortId },
        authMode: getters['userData/isAuthenticated'] ? undefined : 'API_KEY'
      })
      commit('GET_IDEA_OK', data.getIdea)
    } catch (e) {
      commit('GET_IDEA_ERR', e)
      app.$sentry.captureException(e)
      throw e
    }
  },

  async getQueue({ commit, state, getters }, { app, limit = 10 }) {
    const nextToken = getters.currQueue.nextToken
    try {
      commit('GET_QUEUE')
      const data = await loadIdeas(
        app.$amplifyApi,
        'getPublicIdeas',
        getPublicIdeasForQueue,
        {
          nextToken,
          order: categoriesOrders[state.currCategory],
          topOption: state.topOption,
          limit
        },
        'API_KEY'
      )

      commit('GET_QUEUE_OK', data)
    } catch (e) {
      commit('GET_QUEUE_ERR', e)
      app.$sentry.captureException(e)
      throw e
    }
  },

  async updateIndex(
    { commit, dispatch, getters },
    { app, ideaIdx, direction }
  ) {
    let index = ideaIdx
    if (typeof direction !== 'undefined') {
      index = Math.max(getters.currIndex + direction, 0)
    }

    if (index > getters.currIdeas.length - 3) {
      await dispatch('getQueue', { app })
    }

    if (index >= getters.currIdeas.length) {
      index = Math.max(getters.currIdeas.length - 1, 0)
    }

    commit('UPDATE_QUEUE_INDEX', index)
  }
}

export const mutations = {
  UPDATE_CREATED(state, ideaId) {
    state.createdIdeaId = ideaId
  },

  GET_IDEA(state) {
    state.loadingIdea = true
  },

  GET_IDEA_OK(state, idea) {
    const ideas = state.ideasQueues[state.currCategory].ideas
    const idx = ideas.findIndex(i => i.id === idea.id)
    if (idx === -1) {
      ideas.unshift(idea)
    } else {
      Object.assign(ideas[idx], idea)
    }
    state.loadingIdea = false
  },

  GET_IDEA_ERR(state) {
    state.loadingIdea = false
  },

  GET_QUEUE(state) {
    state.ideasQueues[state.currCategory].loading = true
  },

  GET_QUEUE_OK(state, data) {
    const queue = state.ideasQueues[state.currCategory]
    queue.ideas = queue.ideas.concat(data.ideas)
    queue.ideas = uniqBy(queue.ideas, 'ideaId') // Remove duplicates
    queue.nextToken = data.nextToken
    queue.loading = false
  },

  GET_QUEUE_ERR(state, e) {
    state.ideasQueues[state.currCategory].loading = false
  },

  UPDATE_CURR_CATEGORY(state, category) {
    state.currCategory = category || state.currCategory
  },

  UPDATE_TOP_OPTION(state, option) {
    state.topOption = option
  },

  UPDATE_QUEUE_INDEX(state, index) {
    state.ideasQueues[state.currCategory].currIndex = index
  },

  UPDATE_IDEA(state, idea) {
    let idx
    Object.keys(state.ideasQueues).find(k => {
      idx = state.ideasQueues[k].ideas.findIndex(i => i.ideaId === idea.ideaId)
      return idx !== -1
    })
    if (idx === -1) {
      return
    }
    Object.assign(state.ideasQueues[state.currCategory].ideas[idx], idea)
  }
}

export const getters = {
  currQueue: state => {
    return state.ideasQueues[state.currCategory]
  },

  currIdeas: (state, getters) => {
    return getters.currQueue.ideas
  },

  currIndex: (state, getters) => {
    return getters.currQueue.currIndex
  },

  currIdea: (state, getters) => {
    return getters.currQueue.ideas[getters.currQueue.currIndex]
  },

  firstIdea: (state, getters) => {
    return getters.currQueue.ideas.length && getters.currQueue.ideas[0]
  }
}
