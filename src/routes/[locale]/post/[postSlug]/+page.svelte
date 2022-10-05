<script lang="ts">
  import {PortableText} from '@portabletext/svelte'
  import {formatDate} from '$lib/utils/string'
  import classes from '$lib/text.module.css'
  import SanityPicture from '$lib/components/SanityPicture.svelte'
  import type {PageData} from './$types'

  export let data: PageData
  $: ({post} = data)
</script>

<div class="container">
  <article>
    <div class="cover">
      <div class="text">
        <h1 class={classes.title}>{post.title}</h1>
        {#if post.subtitle}
          <p class={classes.subtitle}>{post.subtitle}</p>
        {/if}
        <div class="metadata">
          <div>{formatDate(post.datePublished)}</div>
          <div>{post.author}</div>
        </div>
      </div>
      {#if post.mainImage}
        <SanityPicture
          image={post.mainImage}
          metadata={post.mainImage.metadata}
          alt="Picture"
        />
      {/if}
    </div>
    {#if post.body}
      <div class={classes.body}>
        <PortableText value={post.body} />
      </div>
    {/if}
  </article>
</div>

<style>
  article {
    display: flex;
    padding: var(--spacing-0);
    flex-direction: column;
  }

  .cover {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-0);
  }

  .text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--spacing-2);
  }
</style>
