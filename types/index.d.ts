import { StoreOptions, Store } from 'vuex'

export declare function createStore<S>(storeClass: typeof Store, options: StoreOptions<S>): Store<S>;

declare const _default: {
  createStore: typeof createStore;
};

export default _default;