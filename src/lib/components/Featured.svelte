<script lang="ts">
  import SanityPicture from './SanityPicture.svelte'
  import type {Post} from '$lib/types'
  import {formatDate, titleCase} from '$lib/utils/string'

  export let post: Post
</script>

<div class="featured-container">
  <div class="picture-container">
    <SanityPicture
      image={post.image}
      metadata={post.image.metadata}
      alt="placeholder"
    />
  </div>
  <div class="metadata-row">
    <span class="date"
      >{formatDate(post.datePublished, true)}</span
    >
    <span class="locations">
      {post.locations
        .map((loc) =>
          titleCase(loc.title.replaceAll('-', ' '))
        )
        .join(', ')}
    </span>
    <span class="tags">
      {post.tags.map((tag) => titleCase(tag.title)).join(', ')}
    </span>
  </div>
  <h2>
    {post.title}
  </h2>
  {#if post.excerpt}
    <p>
      {post.excerpt}
    </p>
  {/if}
</div>

<style>
  .picture-container {
    width: 100%;
    aspect-ratio: 4 / 2;
  }

  .metadata-row {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    font-size: 0.8rem;
    height: 2rem;
    gap: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }
</style>
