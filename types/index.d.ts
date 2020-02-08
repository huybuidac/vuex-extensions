import { Store, StoreOptions, GetterTree, ActionTree, MutationTree } from 'vuex'

/**
 * Configurable options for `store.reset`
 */
export interface ResetModuleOption {
  /**
   * Whether this module is resetted or not
   * 
   * If undefined, it equals `parent's nest` property
   */
  self?: boolean
  /**
   * Whether all sub modules are resetted or not
   * 
   * If undefined, it will be assigned by `self`
   */
  nested?: boolean
  /**
   * Detail configuration for all submodules
   */
  modules?: {
    [key: string]: ResetModuleOption
  }
}


export interface StoreExtended<S> extends Store<S> {
  /**
   * Reset store
   * @param options root module configuration
   * 
   * - Please see https://github.com/huybuidac/vuex-extensions for detail
   * 
   * - If undefined, entire store will be reset
   */
  reset(options?: ResetModuleOption): void;
}

export interface StoreOptionsExtended<S> extends StoreOptions<S> {
  mixins?: {
    getters?: GetterTree<S, S>;
    actions?: ActionTree<S, S>;
    mutations?: MutationTree<S>;
  };
}

export declare function createStore<S>(vuexStoreClass: typeof Store, options?: StoreOptionsExtended<S>): StoreExtended<S>
