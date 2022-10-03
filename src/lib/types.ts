export interface Ref {
  _key?: string
  _ref: string
  _type: string
}

/* meant for categorical items in
 * Sanity that we use to filter or tag posts
 * */
export interface Category {
  name: string
  color: string
}

export interface Post {
  author: string
  datePublished: string
  dateUpdated: string
  locations: string[]
  title: string
  slug: string
  tags: {[locale: string]: string}[]
  imageUrl: string
}

import type {SvelteComponentTyped} from 'svelte'
export type SvelteComponentProps<T> =
  T extends SvelteComponentTyped<infer P, any, any> ? P : never
