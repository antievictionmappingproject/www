<script lang="ts">
  import classes from '$lib/text.module.css'
  import {PortableText} from '@portabletext/svelte'
  import type {PortableTextBlock} from '@portabletext/types'

  export let body: PortableTextBlock
</script>

<div class={classes.subtitle}>
  <PortableText value={body} />
</div>

<style>
  div {
    padding-inline: var(--spacing-0);
    font-family: var(--font-family-sans);
    margin-inline: auto;
    text-align: center;
  }
</style>
