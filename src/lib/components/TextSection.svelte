<script lang="ts">
  import classes from '$lib/text.module.css'
  import {PortableText} from '@portabletext/svelte'
  import type {PortableTextBlock} from '@portabletext/types'

  export let body: PortableTextBlock
</script>

<div class={classes.body}>
  <PortableText value={body} />
</div>
