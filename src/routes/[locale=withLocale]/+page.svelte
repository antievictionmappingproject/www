<script lang="ts">
  import classes from '$lib/text.module.css'
  import {page} from '$app/stores'
  import type {Data} from './+page.server'

  import LL from '$i18n/i18n-svelte'
  /* this page should be filled in with
    content from sanity, not hard-coded

    but hard-coding right now for demo/dev purposes
  */
  export let data: Data
  $: ({previews} = data)
</script>

{#if data}
  <div class="previews-container">
    <div class="previews">
      {#each previews as preview}
        <div class="preview">
          <a href="/{$page.params.locale}/post/{preview.slug}">
            <img alt={preview.title} src={preview.imageUrl} />
          </a>
        </div>
      {/each}
    </div>
  </div>
  <div class="blurbs">
    <p class={classes.title}>
      The Anti-Eviction Mapping Project
    </p>
    <p>
      {$LL.hi({name: 'User'})}
    </p>
    <p class={classes.subtitle}>
      AEMP is a data-visualization, critical cartography, and
      multimedia storytelling collective documenting
      dispossession and resistance upon gentrifying landscapes.
    </p>
  </div>
{/if}

<style>
  .previews-container {
    overflow-x: auto;
    overflow-y: hidden;
  }

  .previews-container::-webkit-scrollbar {
    height: 0.2rem;
  }
  .previews-container::-webkit-scrollbar-track {
    background: none;
  }
  .previews-container::-webkit-scrollbar-thumb {
    background: var(--color-gray-4);
  }

  .previews {
    display: flex;
    flex-direction: row;
    min-width: max-content;
  }

  .preview {
    position: relative;
  }

  .preview img {
    height: 200px;
  }

  .blurbs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .blurbs p {
    padding: 1rem;
  }

  .highlight {
    font-size: 2rem;
    font-weight: bold;
  }
</style>
