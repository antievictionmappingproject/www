<script>
  import {PortableText} from '@portabletext/svelte'
  import {formatDate} from '$lib/utils/string'
  import classes from '$lib/text.module.css'

  export let data
  $: ({post} = data)
</script>

<div class="container">
  <article>
    {#if post}
      {#if post.imageUrl}
        <img src={post.imageUrl} />
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
</style>
