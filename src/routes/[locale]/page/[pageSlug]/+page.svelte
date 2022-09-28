<script lang="ts">
  import classes from '$lib/text.module.css'
  import {PortableText} from '@portabletext/svelte'
  import type {PageData} from './$types'

  export let data: PageData
  $: ({page} = data)
</script>

<article>
  {#each page.sections as section}
    <div class={classes.body}>
      <PortableText value={section.body} />
    </div>
  {/each}
</article>
