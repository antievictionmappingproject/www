<script lang="ts">
  import type {SvelteComponentProps} from '$lib/types'
  import PostStub from '$lib/components/PostStub.svelte'

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
    grid-template-columns: repeat(2, 1fr);
    grid-gap: var(--spacing-0);
    align-items: end;
  }

  section > :global(*) {
    grid-column-end: span 2;
  }
</style>
