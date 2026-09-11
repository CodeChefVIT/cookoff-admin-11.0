import type { StoreApi, UseBoundStore } from 'zustand';

type StateOf<S> = S extends { getState: () => infer T } ? T : never;

type WithSelectors<S> = {
  use: { [K in keyof StateOf<S>]: () => StateOf<S>[K] };
};

export function createSelectors<S extends UseBoundStore<StoreApi<object>>>(
  store: S
): S & WithSelectors<S> {
  const use = {} as WithSelectors<S>['use'];
  for (const key of Object.keys(store.getState())) {
    (use as Record<string, () => unknown>)[key] = () =>
      store(s => (s as Record<string, unknown>)[key]);
  }
  return Object.assign(store, { use });
}
