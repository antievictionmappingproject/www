<script lang="ts" context="module">
  import groq from 'groq'
  import {query as postStubQuery} from '$lib/components/PostStub.svelte'

  export const query = groq`{
      "posts": posts[]->${postStubQuery}
    }
  `
</script>

<script lang="ts">
  import type {SvelteComponentProps} from '$lib/types'
  import PostStub from './PostStub.svelte'

  export let posts: SvelteComponentProps<PostStub>[]
</script>

<section>
  {#each posts as post}
    <PostStub {...post} />
  {/each}
</section>

<style>
  section {
    display: grid;
    padding-inline: var(--spacing-0);
    grid-template-columns: repeat(3, 1fr);
    grid-gap: var(--spacing-0);
  }
</style>
