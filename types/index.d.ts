import { Store, StoreOptions, GetterTree, ActionTree, MutationTree } from 'vuex'

export interface ResetableStore<S> extends Store<S> {
  reset(): void;
}

export interface MixinStoreOptions<S> extends StoreOptions<S> {
  mixins?: {
    getters?: GetterTree<S, S>;
    actions?: ActionTree<S, S>;
    mutations?: MutationTree<S>;
  };
}

export declare function createStore<S>(vuexStoreClass: typeof Store, options?: MixinStoreOptions<S>): ResetableStore<S>
