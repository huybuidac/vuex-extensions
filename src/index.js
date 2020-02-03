import { deepCopy, isObject, logger } from './util'

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
      const originalState = getOriginalState(this._modules.root, normalizeResetOption(options))
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

function getOriginalState(module, options, useOriginal = true) {
  const { includes, excludes } = options
  const state = (useOriginal ? module._rawModule._originalState : module.state) || {}
  module.forEachChild((child, key) => {
    const include = includes === true || !!includes[key]
    const exclude = excludes === false ? false : excludes === true || !!excludes[key]

    const nestedOption = {
      includes: includes === true ? true : (includes[key] ?? {}),
      excludes: typeof excludes === 'boolean' ? excludes : (excludes[key] ?? {}),
    }
    state[key] = getOriginalState(child, nestedOption, !exclude && include)
  })
  return state
}

function normalizeResetOption(options = {}) {
  if (isObject(options.includes)) {
    options.includes = buildResetOption(options.includes, {})
  } else {
    // default: reset all modules
    options.includes = true
  }
  if (isObject(options.excludes)) {
    options.excludes = buildResetOption(options.excludes, {})
  } else {
    // default: there is no excluding
    options.excludes = false
  }
  return options
}

/**
 * buildResetOption(['sub1', { name: 'sub2', nested: ['sub21'] }]) => { sub1: 'default', sub2: { sub21: 'default' } }
 */
function buildResetOption(option, container) {
  if (Array.isArray(option)) {
    option.forEach(element => {
      buildResetOption(element, container)
    });
  } else if (typeof option === 'object') {
    if (option.name) {
      container[option.name] = option.nested ? buildResetOption(option.nested, {}) : true
    } else {
      logger.error(`store.reset: ${JSON.stringify(option)} name is required`)
    }
  } else if (typeof option === 'string') {
    container[option] = true
  } else {
    logger.error(`store.reset: ${JSON.stringify(option)} is not supported, plz using Array|String|Object types`)
  }
  return container
}

export {
  createStore
}