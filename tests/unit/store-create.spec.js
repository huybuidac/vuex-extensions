import Vuex from 'vuex'
import Vue from 'vue'

import { createStore } from '../../src'

Vue.use(Vuex)

describe('Store->create', () => {
  it('create twice', () => {
    expect(Vuex.Store.prototype.reset).toBe(undefined)
    
    // first
    createStore(Vuex.Store)
    var firstReset = Vuex.Store.prototype.reset

    // second
    createStore(Vuex.Store, { })

    expect(Vuex.Store.prototype.reset).toEqual(firstReset)
  })
})