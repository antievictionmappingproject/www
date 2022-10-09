<script lang="ts" context="module">
  interface Filter {
    slug: string
    title: string
  }
</script>

<script lang="ts">
  import {nextUniqueId} from '$lib/utils/uniqueId'

  export let tags: Filter[] = []
  export let locations: Filter[] = []

  const id = nextUniqueId()
</script>

<div class="filters">
  {#each [{title: 'Tags', filters: tags}, {title: 'Locations', filters: locations}] as { title, filters }}
    <section>
      <div class="sectionLabel">{title}</div>
      <ul>
        {#each filters as filter}
          <li>
            <input
              id={`${id}-${filter.slug}`}
              type="checkbox"
            />
            <label for={`${id}-${filter.slug}`}>
              {filter.title}
            </label>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>

<style>
  section {
    margin: 1rem 0;
  }

  .sectionLabel {
    font-size: 1rem;
    text-transform: uppercase;
    color: var(--faded-text);
  }

  ul {
    display: flex;
    flex-direction: column;
  }
</style>
