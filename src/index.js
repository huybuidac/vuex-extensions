import { deepCopy } from './util'

const createStore = (vuexStoreClass, options = {}) => {
  const mixins = options.mixins || {}

  // static module
  injectModule(options, mixins)
  Object.values(options.modules || {}).forEach(m => {
    injectModule(m, mixins)
  })

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

    vuexStoreClass.prototype.getInitialModuleState = function (context) {
      if (!context || typeof context === 'string') {
        const module = getModuleByNamespace(this, normalizeNamespace(context))
        if (module) {
          return deepCopy(module._rawModule.originalState)
        } else {
          return null
        }
      } else {
        return deepCopy(getOriginalModuleState(this._modules.root, context))
      }
    }
  }

  const store = new vuexStoreClass(options)
  return store
}

function injectModule(m, mixins) {
  m.originalState = deepCopy((typeof m.state === 'function' ? m.state() : m.state) || {})

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
}

function getOriginalState(module) {
  const state = module._rawModule.originalState || {}
  module.forEachChild((child, key) => {
    state[key] = getOriginalState(child)
  })
  return state
}

function getOriginalModuleState(module, actionContext) {
  // HACK: match by `dispatch` because actionContext wraps localContext
  if (module.context.dispatch === actionContext.dispatch) {
    return module._rawModule.originalState
  }
  const modules = []
  module.forEachChild(child => modules.push(child))
  for (const childModule of modules) {
    const originalState = getOriginalModuleState(childModule, actionContext)
    if (originalState) {
      return originalState
    }
  }
  return null
}

function normalizeNamespace (namespace) {
  if (namespace && namespace.charAt(namespace.length - 1) !== '/') {
    namespace += '/'
  }
  return namespace
}

function getModuleByNamespace (store, namespace) {
  if (namespace) {
    return store._modulesNamespaceMap[namespace]
  } else {
    return store._modules.root
  }
}


export {
  createStore
}