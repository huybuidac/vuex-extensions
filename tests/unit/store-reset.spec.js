import Vuex from 'vuex'
import Vue from 'vue'

import { createStore } from '../../src'

Vue.use(Vuex)

const TEST = 'TEST'

describe('Store->reset', () => {
  it('reset root module & deep clone', done => {
    const store = createStore(Vuex.Store, {
      state: {
        count: 0,
        arr: [],
        obj: {
          name: 0
        }
      },
      mutations: {
        [TEST]: state => {
          state.count++
          state.arr.push(1)
          state.obj.name = 1
        }
      }
    })
    store.commit(TEST)

    Vue.nextTick(() => {
      expect(store.state.count).toBe(1)
      expect(store.state.arr.length).toBe(1)
      expect(store.state.obj.name).toBe(1)

      store.reset()
      Vue.nextTick(() => {
        expect(store.state.count).toBe(0)
        expect(store.state.arr.length).toBe(0)
        expect(store.state.obj.name).toBe(0)
        done()
      })
    })
  }),

  it('reset sub module', done => {
    const store = createStore(Vuex.Store, {
      modules: {
        sub: {
          namespaced: true,
          state: {
            count: 0
          },
          mutations: {
            [TEST]: state => state.count++
          }
        }
      }
    })
    // console.log(store)
    store.commit('sub/' + TEST)

    Vue.nextTick(() => {
      expect(store.state.sub.count).toBe(1)

      store.reset()
      Vue.nextTick(() => {
        expect(store.state.sub.count).toBe(0)
        done()
      })
    })
  })

  it('reset twice', done => {
    const store = createStore(Vuex.Store, {
      state: {
        arr: [],
      },
      mutations: {
        [TEST]: state => {
          state.arr.push(1)
        }
      }
    })
    store.commit(TEST)

    Vue.nextTick(() => {
      expect(store.state.arr.length).toBe(1)

      store.reset()
      Vue.nextTick(() => {
        expect(store.state.arr.length).toBe(0)

        store.commit(TEST)
        Vue.nextTick(() => {
          expect(store.state.arr.length).toBe(1)

          store.reset()
          Vue.nextTick(() => {
            expect(store.state.arr.length).toBe(0)

            done()
          })
        })
      })
    })
  })
})