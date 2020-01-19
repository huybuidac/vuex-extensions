"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = void 0;

var _util = require("./util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createStore = function createStore(vuexStoreClass) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var mixins = options.mixins || {}; // static module

  injectModule(options, mixins);
  Object.values(options.modules || {}).forEach(function (m) {
    injectModule(m, mixins);
  });

  if (!vuexStoreClass.prototype.reset) {
    // dynamic module
    var rawRegisterModule = vuexStoreClass.prototype.registerModule;

    vuexStoreClass.prototype.registerModule = function (path, rawModule) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      injectModule(rawModule, mixins);
      rawRegisterModule.call(this, path, rawModule, options);
    }; // reset to original state


    vuexStoreClass.prototype.reset = function () {
      var originalState = getOriginalState(this._modules.root);
      this.replaceState((0, _util.deepCopy)(originalState));
    };
  }

  var store = new vuexStoreClass(options);
  return store;
};

exports.createStore = createStore;

function injectModule(m, mixins) {
  m.originalState = (0, _util.deepCopy)((typeof m.state === 'function' ? m.state() : m.state) || {});
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
}

function getOriginalState(module) {
  var state = module._rawModule.originalState || {};
  module.forEachChild(function (child, key) {
    state[key] = getOriginalState(child);
  });
  return state;
}