<template>
  <div id="app">
    Clicked: {{ count }} times.
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
  setup () {
    const store = useStore()
    return {
      count: computed(() => store.state.counter.count),
      increment: () => store.dispatch('counter/increment'),
      decrement: () => store.dispatch('counter/decrement'),
      reset: () => store.reset(),
    }
  }
}
</script>