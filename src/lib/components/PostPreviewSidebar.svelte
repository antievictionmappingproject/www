<script lang="ts" context="module">
  import {query as filterAnchorQuery} from '$lib/components/FilterAnchor.svelte'

  export interface Post {
    title: string
    slug: string
    author: string
    datePublished: string
    dateUpdated: string
    tags: SvelteComponentProps<FilterAnchor>[]
    locations: SvelteComponentProps<FilterAnchor>[]
  }

  export const postQuery = groq`{
    "author": author->name,
    "title": title[$locale],
    "slug": slug.current,
    "tags": tags[]->${filterAnchorQuery},
    "locations": locations[]->${filterAnchorQuery},
    "datePublished": datePublished,
    "dateUpdated": dateUpdated,
    "imageUrl": mainImage.asset->url
  }`
</script>

<script lang="ts">
  import {fade} from 'svelte/transition'
  import {formatDate} from '$lib/utils/string'
  import groq from 'groq'
  import FilterAnchor from './FilterAnchor.svelte'
  import type {SvelteComponentProps} from '$lib/types'

  export let post: Post | undefined
</script>

<div class="root">
  {#key post}
    <div
      in:fade={{delay: 200}}
      out:fade={{duration: 200}}
      class="preview"
    >
      {#if post}
        <h1>{post.title}</h1>
        <h2 class="author">by {post.author}</h2>
        <h2 class="published">
          Published {formatDate(post.datePublished)}
        </h2>
        {#if post.datePublished !== post.dateUpdated}
          <h2 class="updated">
            Last Updated {formatDate(post.dateUpdated)}
          </h2>
        {/if}
        {#if post.tags}
          <div class="tags">
            <h2>Tags</h2>
            <div class="items">
              {#each post.tags as tag, index}
                <FilterAnchor {...tag} />
                {#if index < post.tags.length - 1}
                  ,
                {/if}
              {/each}
            </div>
          </div>
        {/if}
        {#if post.locations}
          <div class="locations">
            <h2>Locations</h2>
            <div class="items">
              {#each post.locations as location, index}
                <FilterAnchor {...location} />
                {#if index < post.locations.length - 1}
                  ,
                {/if}
              {/each}
            </div>
          </div>
        {/if}
      {:else}
        Select a post to see more.
      {/if}
    </div>
  {/key}
</div>

<style>
  .root {
    /* so that the fade transition can happen without
       a layout shift
     */
    display: grid;
    grid-template-columns: 1 / 2;
    grid-template-rows: 1 / 2;
  }

  h1 {
    font-size: 2rem;
  }

  .author {
    font-style: italic;
  }

  .tags,
  .locations {
    margin: 1rem 0;
  }

  .items {
    margin: 0.2rem 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
</style>
