import {writable} from 'svelte/store'
import type {Category} from './types'

export const tags = writable(
  new Map() as Map<string, Category>
)
export const locations = writable(
  new Map() as Map<string, Category>
)
