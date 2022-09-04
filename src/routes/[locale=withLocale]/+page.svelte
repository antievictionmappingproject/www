<script lang="ts">
  import {page} from '$app/stores'
  import type {Data} from './+page.server'
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
    <p class="highlight">
      The Anti-Eviction Mapping Project is a
      data-visualization, critical cartography, and multimedia
      storytelling collective documenting dispossession and
      resistance upon gentrifying landscapes.
    </p>
    <p class="info">
      Primarily working in the San Francisco Bay Area, Los
      Angeles, and New York City, we are all volunteers
      producing digital maps, software and tools, narrative
      multimedia work, murals, reports, and community events.
      Working with a number of community partners and in
      solidarity with housing movements globally, we study and
      visualize entanglements of racial capitalism,
      technocapitalism, and political economy, while providing
      tools for resistance. Our narrative oral history and
      video work centers the displacement of people and complex
      social worlds, but also modes of resistance. Maintaining
      antiracist and feminist analyses as well as decolonial
      methodology, the project creates tools and disseminates
      data contributing to collective resistance and movement
      building.
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
