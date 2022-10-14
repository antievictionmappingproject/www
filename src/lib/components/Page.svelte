<script lang="ts">
  import TextSection from '$lib/components/TextSection.svelte'
  import ThreePostSection from '$lib/components/ThreePostSection.svelte'
  import TwoPostSection from '$lib/components/TwoPostSection.svelte'
  import type {SvelteComponentProps} from '$lib/types'

  type Section = {_type: string} & (
    | SvelteComponentProps<TextSection>
    | SvelteComponentProps<TwoPostSection>
    | SvelteComponentProps<ThreePostSection>
  )

  export let sections: Section[]
</script>

<article>
  {#each sections as section}
    {#if section._type == 'textSection'}
      <TextSection {...section} />
    {:else if section._type == 'twoPostSection'}
      <TwoPostSection {...section} />
    {:else if section._type == 'threePostSection'}
      <ThreePostSection {...section} />
    {/if}
  {/each}
</article>

<style>
  article {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }
</style>
