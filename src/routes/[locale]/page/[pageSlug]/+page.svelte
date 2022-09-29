<script lang="ts">
  import ThreePostSection from '$lib/components/ThreePostSection.svelte'
  import TwoPostSection from '$lib/components/TwoPostSection.svelte'
  import classes from '$lib/text.module.css'
  import {PortableText} from '@portabletext/svelte'
  import type {PageData} from './$types'

  export let data: PageData
  $: ({page} = data)
</script>

<article>
  {#each page.sections as section}
    {#if section._type == 'textSection'}
      <div class={classes.body}>
        <PortableText value={section.body} />
      </div>
    {:else if section._type == 'twoPostSection'}
      <TwoPostSection {...section} />
    {:else if section._type == 'threePostSection'}
      <ThreePostSection {...section} />
    {/if}
  {/each}
</article>
