import { Store, StoreOptions, GetterTree, ActionTree, MutationTree } from 'vuex'

export interface ResetModuleOption {
  name: string
  nested?: ResetModuleOption[]
}

export interface StoreExtended<S> extends Store<S> {
  reset(options?: {
    includes?: (string | ResetModuleOption)[],
    excludes?: (string | ResetModuleOption)[]
  }): void;
}

export interface StoreOptionsExtended<S> extends StoreOptions<S> {
  mixins?: {
    getters?: GetterTree<S, S>;
    actions?: ActionTree<S, S>;
    mutations?: MutationTree<S>;
  };
}

export declare function createStore<S>(vuexStoreClass: typeof Store, options?: StoreOptionsExtended<S>): StoreExtended<S>
