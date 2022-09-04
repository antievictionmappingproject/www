<script lang="ts">
  import {page} from '$app/stores'
  import type {Post} from '$lib/types'
  import Tag from './Tag.svelte'
  import {fade} from 'svelte/transition'
  import {formatDate} from '$lib/utils/string'
  export let post: Post

  const locale = $page.params.locale
</script>

<div class="container">
  {#key post}
    <div
      in:fade={{delay: 200}}
      out:fade={{duration: 200}}
      class="preview"
    >
      {#if post}
        <img src={post.imageUrl} />
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
              {#each post.tags as tag}
                <Tag tag={tag[locale]} type="tag" />
              {/each}
            </div>
          </div>
        {/if}
        {#if post.locations}
          <div class="locations">
            <h2>Locations</h2>
            <div class="items">
              {#each post.locations as location}
                <Tag tag={location} type="location" />
              {/each}
            </div>
          </div>
        {/if}
      {/if}
    </div>
  {/key}
</div>

<style>
  .container {
    /* so that the fade transition can happen without 
       a layout shift
     */
    display: grid;
    grid-template-columns: 1 / 2;
    grid-template-rows: 1 / 2;
  }

  .preview {
    /* not really sure how to handle sizing? */
    width: 100%;
    margin: 1rem;
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
