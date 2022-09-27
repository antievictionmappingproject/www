<script lang="ts">
  import Picture from './Picture.svelte'
  import {client, imageProps} from '$lib/sanity'
  import type {SanityImageMetadata} from '$lib/sanity'
  import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
  import breakpoints from '$lib/breakpoints.json'

  export let alt: string
  export let image: SanityImageSource
  export let metadata: SanityImageMetadata

  const widths = Object.values(breakpoints)
</script>

{#key image}
  <Picture
    {...imageProps({image, metadata, client, widths})}
    {alt}
  />
{/key}
