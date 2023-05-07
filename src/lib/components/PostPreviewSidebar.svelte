<script lang="ts">
  import {fade} from 'svelte/transition'
  import {formatDate} from '$lib/utils/string'
  import FilterAnchor from './FilterAnchor.svelte'
  import type {Post} from '$lib/types'

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
              <CommaSeparatedEach items={post.tags} let:item>
                <FilterAnchor {...item} />
              </CommaSeparatedEach>
            </div>
          </div>
        {/if}
        {#if post.locations}
          <div class="locations">
            <h2>Locations</h2>
            <div class="items">
              <CommaSeparatedEach
                items={post.locations}
                let:item
              >
                <FilterAnchor {...item} />
              </CommaSeparatedEach>
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
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    min-width: 15rem;
  }

  .root > * {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
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
