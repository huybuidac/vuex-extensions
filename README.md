# Vuex Extensions
Adding some power funtionanity to Vuex

## Install
You can install it via NPM
```bash
npm install vuex-extensions
```

or YARN
```bash
yarn add vuex-extensions
```

## Usage
Create Vuex.Store by below code:
```js
export default createStore(Vuex.Store, {
	mixins: {
    mutations: {
      changeState: function(state, changed) {
        Object.entries(changed)
          .forEach(([name, value]) => {
            state[name] = value
          })
      }
    }
  }
})
```

Adding reset function to Vuex.Store to helping reset state to initial
```js
this.$store.reset()
```
or reset in module' action
```js
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
