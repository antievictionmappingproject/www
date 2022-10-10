<script lang="ts" context="module">
  interface Filter {
    slug: string
    title: string
  }
</script>

<script lang="ts">
  import {nextUniqueId} from '$lib/utils/uniqueId'
  import uiClasses from '$lib/ui.module.css'

  export let tags: Filter[] = []
  export let locations: Filter[] = []

  const id = nextUniqueId()
</script>

<form>
  {#each [{title: 'Tags', filters: tags}, {title: 'Locations', filters: locations}] as { title, filters }}
    <section>
      <div class="sectionTitle">{title}</div>
      <ul>
        {#each filters as filter}
          <li>
            <input
              id={`${id}-${filter.slug}`}
              name={filter.slug}
              class={uiClasses.checkbox}
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
  <button type="submit" class={uiClasses.input}
    >Apply Filters</button
  >
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
    min-width: 10rem;
  }

  .sectionTitle {
    text-transform: uppercase;
    padding-block-end: var(--spacing-minus-1);
    border-block-end: var(--border-thin);
  }

  ul {
    display: flex;
    flex-direction: column;
  }

  li {
    margin-block: var(--spacing-minus-1);
    display: flex;
    align-items: center;
    gap: var(--spacing-minus-1);
  }
</style>
