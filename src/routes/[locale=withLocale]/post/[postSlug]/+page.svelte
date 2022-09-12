<script>
  import {PortableText} from '@portabletext/svelte'
  import {formatDate} from '$lib/utils/string'
  import Link from '$lib/components/Link.svelte'

  export let data
  $: ({post} = data)
</script>

<div class="container">
  <article>
    {#if post}
      <h1>{post.title}</h1>
      {#if post.imageUrl}
        <img src={post.imageUrl} />
      {/if}
      <h2>{post.author}</h2>
      <span>{formatDate(post.datePublished)}</span>
      {#if post.body}
        <PortableText
          value={post.body}
          components={{marks: {link: Link}}}
        />
      {/if}
    {/if}
  </article>
</div>

<style>
  .container {
    min-height: 0;
    max-height: 100%;
    padding: 1rem 0;
    overflow-y: auto;
    display: flex;
    place-content: center;
  }

  article {
    max-width: 70ch;
    display: flex;
    flex-direction: column;
  }

  /* not quite sure how to best do sizing... */
  img {
    max-width: 80%;
    object-fit: contain;
    align-self: center;
  }

  h1 {
    font-size: 3rem;
  }

  h2 {
    font-size: 2rem;
  }
</style>
