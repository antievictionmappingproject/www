import type {SvelteComponentTyped} from 'svelte'
import type {SanityAsset} from '@sanity/image-url/lib/types/types'

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
  author: Author
  title: string
  slug: string
  tags: Tag[]
  locations: Location[]
  datePublished: string
  dateUpdated: string
  image: SanityAsset
  excerpt: string
}
