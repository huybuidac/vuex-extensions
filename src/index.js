import { deepCopy } from './util'

const createStore = (vuexStoreClass, options = {}) => {
  const mixins = options.mixins || {}

  // static module
  injectModule(options, mixins)

  if (!vuexStoreClass.prototype.reset) {
    // dynamic module
    const rawRegisterModule = vuexStoreClass.prototype.registerModule;
    vuexStoreClass.prototype.registerModule = function (path, rawModule, options = {}) {
      injectModule(rawModule, mixins)
      rawRegisterModule.call(this, path, rawModule, options)
    }

    // reset to original state
    vuexStoreClass.prototype.reset = function () {
      const originalState = getOriginalState(this._modules.root)
      this.replaceState(deepCopy(originalState))
    }
  }

  const store = new vuexStoreClass(options)
  return store
}

function injectModule(m, mixins) {
  m._originalState = deepCopy((typeof m.state === 'function' ? m.state() : m.state) || {})

  const { mutations, actions, getters } = mixins
  if (mutations) {
    m.mutations = { ...mutations, ...(m.mutations || {}) }
  }

  if (actions) {
    m.actions = { ...actions, ...(m.actions || {}) }
  }

  if (getters) {
    m.getters = { ...getters, ...(m.getters || {}) }
  }

  if (m.modules) {
    Object.values(m.modules).forEach(subModule => {
      injectModule(subModule, mixins)
    })
  }
}

function getOriginalState(module) {
  const state = module._rawModule._originalState || {}
  module.forEachChild((child, key) => {
    state[key] = getOriginalState(child)
  })
  return state
}

export {
  createStore
}