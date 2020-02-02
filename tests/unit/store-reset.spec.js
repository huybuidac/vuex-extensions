import Vuex from 'vuex'
import Vue from 'vue'

import { createStore } from '../../src'

Vue.use(Vuex)

const TEST = 'TEST'

describe('Store->reset', () => {
  it('reset root module & deep clone', done => {
    const store = createStore(Vuex.Store, {
      state() {
        return {
          count: 0,
          arr: [],
          obj: {
            name: 0,
            subObj: {
              name: 0
            }
          }
        }
      },
      mutations: {
        [TEST]: state => {
          state.count++
          state.arr.push(1)
          state.obj.name = 1
          state.obj.subObj.name = 1
        }
      }
    })
    store.commit(TEST)

    Vue.nextTick(() => {
      expect(store.state.count).toBe(1)
      expect(store.state.arr.length).toBe(1)
      expect(store.state.obj.name).toBe(1)
      expect(store.state.obj.subObj.name).toBe(1)

      store.reset()
      Vue.nextTick(() => {
        expect(store.state.count).toBe(0)
        expect(store.state.arr.length).toBe(0)
        expect(store.state.obj.name).toBe(0)
        expect(store.state.obj.subObj.name).toBe(0)
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

  it('#16 initial nested module', done => {
    const store = createStore(Vuex.Store, {
      modules: {
        child: {
          namespaced: true,
          state: {
            count: 1
          },
          mutations: {
            [TEST]: state => state.count++
          },
          modules: {
            grandchild: {
              namespaced: true,
              state: {
                count: 1
              },
              mutations: {
                [TEST]: state => state.count++
              }
            }
          }
        }
      }
    })

    store.commit('child/' + TEST)
    store.commit('child/grandchild/' + TEST)

    Vue.nextTick(() => {
      expect(store.state.child.count).toBe(2)
      expect(store.state.child.grandchild.count).toBe(2)

      store.reset()
      Vue.nextTick(() => {
        expect(store.state.child.count).toBe(1)
        expect(store.state.child.grandchild.count).toBe(1)
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