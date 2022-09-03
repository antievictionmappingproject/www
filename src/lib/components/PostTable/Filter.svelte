<script lang="ts">
  import type {Post, Ref} from '$lib/types'
  import {tags, locations} from '$lib/store'
  /* client-side checkbox (atm) filtering
  Given the sort of non-uniform nature of these filters,
  we're coding them individually instead of as one Filters
  object
  */

  type CheckboxFilter = {
    active: false
    display: string
    ref: Ref
  }[]

  export let posts: Post[] = []
  export let filteredPosts: Post[] = []
</script>

<div class="filters">
  <h2>Filter by:</h2>
  {#each [{Tag: $tags}, {Location: $locations}] as store}
    <section>
      <h2>{Object.keys(store)[0]}</h2>
      <div class="categories">
        {#each Array.from(Object.values(store)[0]).sort() as [category, _]}
          <div class="category">
            <input id={category} type="checkbox" />
            <label for={category}>{category}</label>
          </div>
        {/each}
      </div>
    </section>
  {/each}
</div>

<style>
  .filters {
    padding: 0.5rem 1rem;
  }

  h2 {
    font-size: 1rem;
    text-transform: uppercase;
    color: var(--faded-text);
  }

  section {
    margin: 1rem 0;
  }

  .categories {
    display: flex;
    flex-direction: column;
  }

  label {
    font-size: 0.8rem;
  }
</style>
