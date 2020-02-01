import Vuex from 'vuex'
import Vue from 'vue'

import { createStore } from '../../src'

Vue.use(Vuex)

describe('Store->getInitialModuleState', () => {
  it('root/sub module', done => {
    const store = createStore(Vuex.Store, {
      state: {
        count: 0,
      },
      modules: {
        a: {
          namespaced: true,
          state: {
            count: 0
          },
          mutations: {
            change: state => state.count++,
            resetLocal: function(state) {
              const s = this.getInitialModuleState('a')
              Object.keys(s).forEach(key => {
                state[key] = s[key]
              })
            }
          }
        }
      },
      mutations: {
        change: state => state.count++,
        resetLocal: function(state) {
          const s = this.getInitialModuleState('')
          Object.keys(s).forEach(key => {
            state[key] = s[key]
          })
        }
      }
    })
    expect(store.getInitialModuleState().count).toBe(0)
    expect(store.getInitialModuleState('').count).toBe(0)
    expect(store.getInitialModuleState('a').count).toBe(0)
    expect(store.getInitialModuleState('b')).toBe(null)

    store.commit('change')
    store.commit('a/change')
    Vue.nextTick(() => {
      expect(store.state.count).toBe(1)
      expect(store.state.a.count).toBe(1)

      store.commit('resetLocal')
      store.commit('a/resetLocal')

      Vue.nextTick(() => {
        expect(store.state.count).toBe(0)
        expect(store.state.a.count).toBe(0)
        done()
      })
    })
  })

  it('with mixin', done => {
    const store = createStore(Vuex.Store, {
      modules: {
        a: {
          namespaced: true,
          state: {
            count: 0
          },
          mutations: {
            change: state => state.count++
          }
        }
      },
      mixins: {
        actions: {
          resetLocal(context) {
            const s = this.getInitialModuleState(context)
            console.log("resetLocal", s)
            context.commit('changeState', s)
          }
        },
        mutations: {
          changeState: function (state, changed) {
            Object.entries(changed)
              .forEach(([name, value]) => {
                state[name] = value
              })
          }
        }
      }
    })

    store.commit('a/change')
    Vue.nextTick(() => {
      expect(store.state.a.count).toBe(1)

      store.dispatch('a/resetLocal')

      Vue.nextTick(() => {
        expect(store.state.a.count).toBe(0)
        done()
      })
    })
  })
})