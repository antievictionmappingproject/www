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
    {#if post}
      {#if post.mainImage}
        <SanityPicture
          image={post.mainImage}
          metadata={post.mainImage.metadata}
          alt="Picture"
        />
      {/if}
      <h1 class={classes.title}>{post.title}</h1>
      {#if post.subtitle}
        <h2 class={classes.subtitle}>{post.subtitle}</h2>
      {/if}
      <div class="metadata">
        <div>{formatDate(post.datePublished)}</div>
        <div>{post.author}</div>
      </div>
      {#if post.body}
        <div class={classes.body}>
          <PortableText value={post.body} />
        </div>
      {/if}
    {/if}
  </article>
</div>

<style>
  .metadata {
    font-size: var(--font-size-minus-1);
  }

  article {
    display: flex;
    flex-direction: column;
  }
</style>
