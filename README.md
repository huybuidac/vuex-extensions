<p align="center">
  <img alt="vuex-extensions" height="100" src="./docs/images/logo.png">
</p>
<p align="center">
   Reset function and Mixins option for Vuex
</p>
<p align="center">
  <a href="https://circleci.com/gh/huybuidac/vuex-extensions"><img alt="npm" src="https://circleci.com/gh/huybuidac/vuex-extensions.svg?style=svg"></a>
  <a href="https://badge.fury.io/js/vuex-extensions"><img alt="npm" src="https://badge.fury.io/js/vuex-extensions.svg"></a>
  <a href="https://coveralls.io/github/huybuidac/vuex-extensions?branch=master"><img alt="npm" src="https://coveralls.io/repos/github/huybuidac/vuex-extensions/badge.svg?branch=master"></a>
</p>


# Vuex Extensions
Add Reset and Mixins function to Vuex

---

:fire: **HEADS UP!** You're currently looking at Vuex-extensions 1 branch. If you're looking for Vuex-extensions 4, [please check out `vuex4` branch](https://github.com/huybuidac/vuex-extensions/tree/vuex4).

---

## Resources

* Medium: [Reset Vuex Modules to initial state](https://medium.com/@huybuidac_12792/reset-vuex-module-state-d2573bfbd78)
* Medium: [How to use Mixins in Vuex](https://medium.com/@huybuidac_12792/how-to-use-mixins-in-vuex-777f7dc0e5a6)

## Install
You can install it via NPM
```console
npm install vuex-extensions@1.1.5
```

or YARN
```console
yarn add vuex-extensions@1.1.5
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

#### Mixins: adding some default getters/mutations/actions to all modules
```js
    const store = createStore(Vuex.Store, {
      modules: {
        sub: {
          namespaced: true,
          state: {
            count: 0
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
    
    store.commit('sub/changeState', { count: 1 })
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

##### Reset with option
Assume: store has structure as:
```
root
  - state: { count: 0 }
  - modules:
    - child1
      - state: { count: 0 }
      - modules:
        - grandchild1 { state: { count: 0 } }
        - grandchild2 { state: { count: 0 } }
    - child1
      - state: { count: 0 }
      - modules:
        - grandchild1 { state: { count: 0 } }
        - grandchild2 { state: { count: 0 } }
```

After some actions, store has state:
```js
{
  state: { count: 1 },
  child1: { 
    state: { count: 1 }
    grandchild1: { state: { count: 1 } }
    grandchild2: { state: { count: 1 } }
  },
  child1: {
    state: { count: 1 }
    grandchild1: { state: { count: 1 } }
    grandchild2: { state: { count: 1 } }
  }
}
```

```js
// Reset root state only, all submodules are ingored
this.$store.reset({ self: true, nested: false })
// {
//   state: { count: 0 },
//   child1: { 
//     state: { count: 1 }
//     grandchild1: { state: { count: 1 } }
//     grandchild2: { state: { count: 1 } }
//   },
//   child1: {
//     state: { count: 1 }
//     grandchild1: { state: { count: 1 } }
//     grandchild2: { state: { count: 1 } }
//   }
// }

// Reset child1 and all it's sub modules, all other modules are ingored
this.$store.reset({ 
  self: false,
  nested: false, // if nested is not set (undefined), it will be equal to self
  modules: { child1: { self: true} }
})
// {
//   state: { count: 1 },
//   child1: { 
//     state: { count: 0 }
//     grandchild1: { state: { count: 0 } }
//     grandchild2: { state: { count: 0 } }
//   },
//   child1: {
//     state: { count: 1 }
//     grandchild1: { state: { count: 1 } }
//     grandchild2: { state: { count: 1 } }
//   }
// }

// Rest grandchild1 state only, all other modules are ingored
this.$store.reset({ 
  self: false,
  // nested: false,
  modules: { 
    child1: {
      modules: {
        grandchild1: { self: true }
      }
    } 
  }
})
// {
//   state: { count: 1 },
//   child1: { 
//     state: { count: 1 }
//     grandchild1: { state: { count: 0 } }
//     grandchild2: { state: { count: 1 } }
//   },
//   child1: {
//     state: { count: 1 }
//     grandchild1: { state: { count: 1 } }
//     grandchild2: { state: { count: 1 } }
//   }
// }
```

