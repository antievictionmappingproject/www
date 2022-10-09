import type {SvelteComponentTyped} from 'svelte'

export type SvelteComponentProps<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends SvelteComponentTyped<infer P, any, any> ? P : never
