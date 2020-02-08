# Vuex Extensions
Add Reset and Mixins function to Vuex

<hr />

[![CircleCI](https://circleci.com/gh/huybuidac/vuex-extensions.svg?style=svg)](https://circleci.com/gh/huybuidac/vuex-extensions) [![npm version](https://badge.fury.io/js/vuex-extensions.svg)](https://badge.fury.io/js/vuex-extensions) [![Coverage Status](https://coveralls.io/repos/github/huybuidac/vuex-extensions/badge.svg?branch=master)](https://coveralls.io/github/huybuidac/vuex-extensions?branch=master)

## Resources

* Medium: [Reset Vuex Modules to initial state](https://medium.com/@huybuidac_12792/reset-vuex-module-state-d2573bfbd78)
* Medium: [How to use Mixins in Vuex](https://medium.com/@huybuidac_12792/how-to-use-mixins-in-vuex-777f7dc0e5a6)

## Install
You can install it via NPM
```console
npm install vuex-extensions
```

or YARN
```console
yarn add vuex-extensions
```

## Usage

Check out the example on [CodeSandbox](https://codesandbox.io/s/lively-thunder-hrh2o).

[![Edit vuex-persistedstate](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/lively-thunder-hrh2o)

#### Creating Vuex.Store
```js
import Vuex from 'vuex'
import { createStore } from 'vuex-extensions'

export default createStore(Vuex.Store, {
  plugins: []
  modules: {}
})
```

#### Store resets to initial State
```js
// Vue Component
this.$store.reset()
```

```js
// Vuex action
modules: {
  sub: {
    actions: {
      logout() {
        this.reset()
      }
    }
  }
}
```

#### Mixins: adding some default getters/mutations/actions to all modules
```js
    const store = createStore(Vuex.Store, {
      modules: {
        sub: {
          namespaced: true,
          state: {
            count: 0
          },
          actions: {
            test: function({ commit }) {
              commit('changeState', { count: 1 })
            }
          }
        }
      },
      mixins: {
        mutations: {
          changeState: function (state, changed) {
            Object.entries(changed)
              .forEach(([name, value]) => {
                state[name] = value
              })
          }
        }
      }
    })
    
    store.dispatch('sub/test')
```
