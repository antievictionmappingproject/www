import type {SvelteComponentTyped} from 'svelte'

export type SvelteComponentProps<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends SvelteComponentTyped<infer P, any, any> ? P : never

export interface Tag {
  type: string
  title: string
  slug: string
}

export interface Location {
  type: string
  title: string
  slug: string
}

export interface Author {
  name: string
  slug: string
}

export interface Post {
  title: string
  slug: string
  author: Author
  datePublished: string
  dateUpdated: string
  tags: Tag[]
  locations: Location[]
}
