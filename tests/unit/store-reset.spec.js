import Vuex from 'vuex'
import Vue from 'vue'

import { createStore } from '../../src'

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

    expect(store.state.count).toBe(1)
    expect(store.state.arr.length).toBe(1)
    expect(store.state.obj.name).toBe(1)
    expect(store.state.obj.subObj.name).toBe(1)

    store.reset()
    expect(store.state.count).toBe(0)
    expect(store.state.arr.length).toBe(0)
    expect(store.state.obj.name).toBe(0)
    expect(store.state.obj.subObj.name).toBe(0)
    done()
  })

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

    expect(store.state.sub.count).toBe(1)

    store.reset()
    expect(store.state.sub.count).toBe(0)
    done()
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

    expect(store.state.child.count).toBe(2)
    expect(store.state.child.grandchild.count).toBe(2)

    store.reset()
    expect(store.state.child.count).toBe(1)
    expect(store.state.child.grandchild.count).toBe(1)
    done()
  })

  it('reset twice', done => {
    const store = createStore(Vuex.Store, {
      state: {
        arr: []
      },
      mutations: {
        [TEST]: state => {
          state.arr.push(1)
        }
      }
    })
    store.commit(TEST)

    expect(store.state.arr.length).toBe(1)

    store.reset()
    expect(store.state.arr.length).toBe(0)

    store.commit(TEST)
    expect(store.state.arr.length).toBe(1)

    store.reset()
    expect(store.state.arr.length).toBe(0)

    done()
  })

  const generateOptionResetStore = () => {
    const store = createStore(Vuex.Store, {
      state: {
        count: 0
      },
      modules: {
        child1: {
          namespaced: true,
          state: {
            count: 0
          },
          modules: {
            grand1: {
              namespaced: true,
              state: {
                count: 0
              }
            },
            grand2: {
              namespaced: true,
              state: {
                count: 0
              }
            }
          }
        },
        child2: {
          namespaced: true,
          state: {
            count: 0
          },
          modules: {
            grand1: {
              namespaced: true,
              state: {
                count: 0
              }
            },
            grand2: {
              namespaced: true,
              state: {
                count: 0
              }
            }
          }
        }
      },
      mixins: {
        mutations: {
          increase: state => state.count++
        }
      }
    })
    store.commit('increase')
    store.commit('child1/increase')
    store.commit('child1/grand1/increase')
    store.commit('child1/grand2/increase')
    store.commit('child2/increase')
    store.commit('child2/grand1/increase')
    store.commit('child2/grand2/increase')

    return store
  }

  it('reset only 1 module', done => {
    const store = generateOptionResetStore()
    store.reset({
      self: false,
      modules: {
        child1: {
          modules: {
            grand1: {
              self: true
            }
          }
        }
      }
    })

    expect(store.state.count).toBe(1)
    expect(store.state.child1.count).toBe(1)
    expect(store.state.child1.grand1.count).toBe(0)
    expect(store.state.child1.grand2.count).toBe(1)
    expect(store.state.child2.count).toBe(1)
    expect(store.state.child2.grand1.count).toBe(1)
    expect(store.state.child2.grand2.count).toBe(1)
    done()
  })

  it('reset all without 1', done => {
    const store = generateOptionResetStore()
    store.reset({
      self: true,
      modules: {
        child2: {
          modules: {
            grand2: {
              self: false
            }
          }
        }
      }
    })

    expect(store.state.count).toBe(0)
    expect(store.state.child1.count).toBe(0)
    expect(store.state.child1.grand1.count).toBe(0)
    expect(store.state.child1.grand2.count).toBe(0)
    expect(store.state.child2.count).toBe(0)
    expect(store.state.child2.grand1.count).toBe(0)
    expect(store.state.child2.grand2.count).toBe(1)
    done()
  })

  it('reset overlap parent default', done => {
    const store = generateOptionResetStore()
    store.reset({
      self: false,
      nested: true,
      modules: {
        child2: {
          self: false,
          nested: true,
          modules: {
            grand2: {
              self: false
            }
          }
        }
      }
    })

    expect(store.state.count).toBe(1)
    expect(store.state.child1.count).toBe(0)
    expect(store.state.child1.grand1.count).toBe(0)
    expect(store.state.child1.grand2.count).toBe(0)
    expect(store.state.child2.count).toBe(1)
    expect(store.state.child2.grand1.count).toBe(0)
    expect(store.state.child2.grand2.count).toBe(1)
    done()
  })

  it('reset -> #29 check unwanted watcher', done => {
    const store = createStore(Vuex.Store, {
      state: {
        count: 0
      },
      modules: {
        child1: {
          namespaced: true,
          state: {
            count: 0
          }
        },
        child2: {
          namespaced: true,
          state: {
            count: 0
          }
        }
      },
      mixins: {
        mutations: {
          increase: state => state.count++
        }
      }
    })

    store.commit('child2/increase')

    expect(store.state.child2.count).toBe(1)

    var rootChanged = false
    var child1Changed = false
    var child2Changed = false
    store.watch(
      state => state.count,
      () => (rootChanged = true)
    )
    store.watch(
      state => state.child1.count,
      () => (child1Changed = true)
    )
    store.watch(
      state => state.child2.count,
      () => (child2Changed = true)
    )

    store.reset({
      self: false,
      modules: {
        child2: {
          self: true
        }
      }
    })
    expect(rootChanged).toBe(false)
    expect(child1Changed).toBe(false)
    setTimeout(() => {
      expect(child2Changed).toBe(true)
      expect(store.state.child2.count).toBe(0)
      done()
    }, 500)
  })
})
