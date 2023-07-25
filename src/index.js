const deepCopy = require('./util')({circles: true})

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
    vuexStoreClass.prototype.reset = function (options) {
      const originalState = getOriginalState(this._modules.root, deepCopy(this._vm._data.$$state), options)
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

function getOriginalState(module, moduleVueState, options = {}, defaultReset = true) {
  if (options.self === undefined) {
    options.self = defaultReset
  }
  if (options.nested === undefined) {
    options.nested = options.self
  }
  const state = options.self ? module._rawModule._originalState : moduleVueState
  module.forEachChild((childModule, key) => {
    let nestOption = {}
    if (options.modules && options.modules[key]) {
      nestOption = { ...options.modules[key] }
    }
    state[key] = getOriginalState(childModule, moduleVueState[key], nestOption, options.nested)
  })
  return state
}

export {
  createStore
}