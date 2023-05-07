<script lang="ts">
  import {onMount} from 'svelte'

  export let src: string
  export let alt: string
  export let naturalWidth: number | undefined = undefined
  export let naturalHeight: number | undefined = undefined
  export let srcset: string | undefined = undefined
  export let sizes: string | undefined = undefined
  export let placeholderSrc: string | undefined = undefined
  export let loading: 'eager' | 'lazy' = 'lazy'
  export let objectFit: 'cover' | 'contain' = 'cover'

  let imageElement: HTMLImageElement
  let isLoaded = false
  let isMounted = false

  $: backgroundImage =
    placeholderSrc != null
      ? `url(${placeholderSrc})`
      : undefined

  onMount(() => {
    isMounted = true

    if (imageElement?.complete) {
      isLoaded = true
    }
  })
</script>

<picture
  class:isMounted
  style:--background-image={backgroundImage}
  style:--object-fit={objectFit}
>
  <img
    {loading}
    {alt}
    {src}
    {srcset}
    {sizes}
    class:isLoaded
    bind:this={imageElement}
    on:load={() => {
      isLoaded = true
    }}
  />
</picture>

<style>
  picture {
    position: relative;
    aspect-ratio: var(--aspect-ratio);
    background-image: var(--background-image);
    background-position: var(--object-position);
    background-size: var(--object-fit);
    background-repeat: no-repeat;
    display: block;
    width: 100%;
    height: 100%;
  }

  picture > img {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    object-fit: var(--object-fit);
    object-position: var(--object-position);
  }

  picture.isMounted > img:not(.isLoaded) {
    opacity: 0;
  }
</style>
