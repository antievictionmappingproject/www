<script lang="ts">
  import textClasses from '$lib/text.module.css'
  import {uniqBy, prop} from 'ramda'
  import {LL} from '$i18n/i18n-svelte'
  import {page} from '$app/stores'
  import PostTable from '$lib/components/PostTable.svelte'
  import FilterSidebar from '$lib/components/FilterSidebar.svelte'
  import FilterSidebarFieldset from '$lib/components/FilterSidebarFieldset.svelte'
  import type {Filter} from '$lib/components/FilterSidebarFieldset.svelte'
  import PostPreviewSidebar from '$lib/components/PostPreviewSidebar.svelte'
  import {nextUniqueId} from '$lib/utils/uniqueId'
  import type {Post} from '$lib/types'

  const titleId = nextUniqueId()

  export let data: {
    posts: Post[]
    tags: Filter[]
    locations: Filter[]
  }

  let selectedPost: Post | undefined = undefined

  $: query = $page.url.searchParams.get('query') ?? undefined
</script>

<section>
  <h1 id={titleId} class={textClasses.titleSans}>
    {query ? $LL.search.results({query}) : 'Posts'}
  </h1>
  <FilterSidebar {query}>
    <FilterSidebarFieldset
      title="Tags"
      name="tags"
      filters={data.tags}
    />
    <FilterSidebarFieldset
      title="Locations"
      name="locations"
      filters={data.locations}
    />
  </FilterSidebar>
  <PostTable posts={data.posts} labelledBy={titleId} />
  <PostPreviewSidebar post={selectedPost} />
</section>

<style>
  section {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: var(--spacing-0);
    padding-inline: var(--spacing-0);
  }

  h1 {
    grid-column: 1 / -1;
    margin-block: calc(var(--spacing-2) - var(--spacing-0));
  }
</style>
