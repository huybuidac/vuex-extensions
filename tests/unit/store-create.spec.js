import Vuex from 'vuex'
import Vue from 'vue'

import { createStore } from '../../src'

Vue.use(Vuex)

describe('Store->create', () => {
  it('create with null options', () => {
    createStore(Vuex.Store)
  })
})