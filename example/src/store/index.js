import { createStore } from '../../../'
import { Store } from 'vuex'

export default createStore(Store, {
  state: { count: 0 },
  modules: {
    counter: {
      namespaced: true,
      state: {
        count: 0,
      },
      actions: {
        increment: ({ commit, state }) => commit('changeState', { count: state.count + 1 }),
        decrement: ({ commit, state }) => commit('changeState', { count: state.count - 1 }),
      },
    },
  },
  mixins: {
    mutations: {
      changeState: function (state, changed) {
        Object.entries(changed).forEach(([name, value]) => {
          state[name] = value
        })
      },
    },
  },
})
