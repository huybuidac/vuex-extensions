import Vuex from 'vuex'
import Vue from 'vue'

import { createStore } from '../../src'

describe('Store->mixins', () => {
  it('root module adds changeState mutation', done => {
    const store = createStore(Vuex.Store, {
      state: {
        count: 0
      },
      mixins: {
        mutations: {
          changeState: function(state, changed) {
            Object.entries(changed).forEach(([name, value]) => {
              state[name] = value
            })
          }
        }
      }
    })
    store.commit('changeState', { count: 1 })
    expect(store.state.count).toBe(1)
    done()
  })

  it('getter mixins', done => {
    const store = createStore(Vuex.Store, {
      state: {
        count: 0
      },
      modules: {
        sub: {
          namespaced: true,
          state: {
            count: 1
          }
        }
      },
      mixins: {
        getters: {
          getState: state => name => {
            return state[name]
          }
        }
      }
    })

    expect(store.getters['getState']('count')).toBe(0)
    expect(store.getters['sub/getState']('count')).toBe(1)
    done()
  })

  it('root module adds changeState mutation', done => {
    const store = createStore(Vuex.Store, {
      state: {
        count: 0
      },
      mixins: {
        actions: {
          test({ commit }) {
            commit('changeCount')
          }
        },
        mutations: {
          changeCount(state) {
            state.count = 1
          }
        }
      }
    })

    store.dispatch('test')
    expect(store.state.count).toBe(1)
    done()
  })

  it('sub module adds changeState mutation', done => {
    const store = createStore(Vuex.Store, {
      modules: {
        sub: {
          namespaced: true,
          state: {
            count: 0
          },
          actions: {
            test: function({ commit }) {
              commit('changeState', { count: 1 })
            }
          }
        }
      },
      mixins: {
        mutations: {
          changeState: function(state, changed) {
            Object.entries(changed).forEach(([name, value]) => {
              state[name] = value
            })
          }
        }
      }
    })
    store.dispatch('sub/test')

    expect(store.state.sub.count).toBe(1)
    done()
  })

  it('register module at runtime', done => {
    const store = createStore(Vuex.Store, {
      modules: {
        child: {
          namespaced: true
        }
      },
      mixins: {
        mutations: {
          changeState: function(state, changed) {
            Object.entries(changed).forEach(([name, value]) => {
              state[name] = value
            })
          }
        }
      }
    })
    store.registerModule(['child', 'grandchild'], {
      namespaced: true,
      state: {
        count: 0
      }
    })
    store.commit('child/grandchild/changeState', { count: 1 })

    expect(store.state.child.grandchild.count).toBe(1)
    done()
  })
})
