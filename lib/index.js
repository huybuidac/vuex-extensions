"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = void 0;

var _util = require("./util");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createStore = function createStore(vuexStoreClass) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var mixins = options.mixins || {}; // static module

  injectModule(options, mixins);

  if (!vuexStoreClass.prototype.reset) {
    // dynamic module
    var rawRegisterModule = vuexStoreClass.prototype.registerModule;

    vuexStoreClass.prototype.registerModule = function (path, rawModule) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      injectModule(rawModule, mixins);
      rawRegisterModule.call(this, path, rawModule, options);
    }; // reset to original state


    vuexStoreClass.prototype.reset = function (options) {
      var originalState = getOriginalState(this._modules.root, normalizeResetOption(options));
      this.replaceState((0, _util.deepCopy)(originalState));
    };
  }

  var store = new vuexStoreClass(options);
  return store;
};

exports.createStore = createStore;

function injectModule(m, mixins) {
  m._originalState = (0, _util.deepCopy)((typeof m.state === 'function' ? m.state() : m.state) || {});
  var mutations = mixins.mutations,
      actions = mixins.actions,
      getters = mixins.getters;

  if (mutations) {
    m.mutations = _objectSpread({}, mutations, {}, m.mutations || {});
  }

  if (actions) {
    m.actions = _objectSpread({}, actions, {}, m.actions || {});
  }

  if (getters) {
    m.getters = _objectSpread({}, getters, {}, m.getters || {});
  }

  if (m.modules) {
    Object.values(m.modules).forEach(function (subModule) {
      injectModule(subModule, mixins);
    });
  }
}

function getOriginalState(module, options) {
  var useOriginal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var includes = options.includes,
      excludes = options.excludes;
  var state = (useOriginal ? module._rawModule._originalState : module.state) || {};
  module.forEachChild(function (child, key) {
    var _includes$key, _excludes$key;

    var include = includes === true || !!includes[key];
    var exclude = excludes === false ? false : excludes === true || !!excludes[key];
    var nestedOption = {
      includes: includes === true ? true : (_includes$key = includes[key]) !== null && _includes$key !== void 0 ? _includes$key : {},
      excludes: typeof excludes === 'boolean' ? excludes : (_excludes$key = excludes[key]) !== null && _excludes$key !== void 0 ? _excludes$key : {}
    };
    state[key] = getOriginalState(child, nestedOption, !exclude && include);
  });
  return state;
}

function normalizeResetOption() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if ((0, _util.isObject)(options.includes)) {
    options.includes = buildResetOption(options.includes, {});
  } else {
    // default: reset all modules
    options.includes = true;
  }

  if ((0, _util.isObject)(options.excludes)) {
    options.excludes = buildResetOption(options.excludes, {});
  } else {
    // default: there is no excluding
    options.excludes = false;
  }

  return options;
}
/**
 * buildResetOption(['sub1', { name: 'sub2', nested: ['sub21'] }]) => { sub1: 'default', sub2: { sub21: 'default' } }
 */


function buildResetOption(option, container) {
  if (Array.isArray(option)) {
    option.forEach(function (element) {
      buildResetOption(element, container);
    });
  } else if (_typeof(option) === 'object') {
    if (option.name) {
      container[option.name] = option.nested ? buildResetOption(option.nested, {}) : true;
    } else {
      _util.logger.error("store.reset: ".concat(JSON.stringify(option), " name is required"));
    }
  } else if (typeof option === 'string') {
    container[option] = true;
  } else {
    _util.logger.error("store.reset: ".concat(JSON.stringify(option), " is not supported, plz using Array|String|Object types"));
  }

  return container;
}