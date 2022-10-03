<script lang="ts">
  import type {SanityImageMetadata} from '$lib/sanity'
  import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
  import SanityPicture from './SanityPicture.svelte'
  import {LL, locale} from '$i18n/i18n-svelte'

  export let image: SanityImageSource & {
    metadata: SanityImageMetadata
  }
  export let title: string
  export let date: string
  export let slug: string
</script>

<div class="root">
  <div class="picture">
    <SanityPicture
      {image}
      metadata={image.metadata}
      alt="Picture"
    />
  </div>
  <div class="text">
    <a class="title" href={`/${$locale}/post/${slug}`}
      >{title}</a
    >
    <div>{$LL.postCard.date(new Date(date))}</div>
  </div>
</div>

<style>
  .root {
    display: contents;
  }

  .picture {
    display: grid;
    grid-row: 1;
    align-self: end;
  }

  .title {
    font-size: var(--font-size-2);
    font-family: var(--font-family-serif);
    line-height: 1.2;
    text-transform: uppercase;
    grid-row: 2;
    align-self: start;
    padding-inline-end: var(--spacing-0);
  }
</style>
