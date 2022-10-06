<script lang="ts" context="module">
  import groq from 'groq'
  import {query as textSectionQuery} from '$lib/components/TextSection.svelte'
  import {query as twoPostSectionQuery} from '$lib/components/TwoPostSection.svelte'
  import {query as threePostSectionQuery} from '$lib/components/ThreePostSection.svelte'

  export const query = groq`{
      "title": title[$locale],
      "sections": sections[] {
        _type,
        _type == "textSection" => ${textSectionQuery},
        _type == "twoPostSection" => ${twoPostSectionQuery},
        _type == "threePostSection" => ${threePostSectionQuery}
      }
    }
  `
</script>

<script lang="ts">
  import TextSection from '$lib/components/TextSection.svelte'
  import ThreePostSection from '$lib/components/ThreePostSection.svelte'
  import TwoPostSection from '$lib/components/TwoPostSection.svelte'
  import type {SvelteComponentProps} from '$lib/types'

  export let sections:
    | SvelteComponentProps<TextSection>
    | SvelteComponentProps<TwoPostSection>
    | SvelteComponentProps<ThreePostSection>
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
