<script lang="ts">
  import textClasses from '$lib/text.module.css'
  import {uniqBy, prop} from 'ramda'
  import {LL} from '$i18n/i18n-svelte'
  import {page} from '$app/stores'
  import PostTable from '$lib/components/PostTable.svelte'
  import type {Post as PostTablePost} from '$lib/components/PostTable.svelte'
  import FilterSidebar from '$lib/components/FilterSidebar.svelte'
  import FilterSidebarFieldset from '$lib/components/FilterSidebarFieldset.svelte'
  import PostPreviewSidebar from '$lib/components/PostPreviewSidebar.svelte'
  import type {Post as PostPreviewSidebarPost} from '$lib/components/PostPreviewSidebar.svelte'
  import {nextUniqueId} from '$lib/utils/uniqueId'

  const titleId = nextUniqueId()

  type Post = PostTablePost & PostPreviewSidebarPost

  export let data: {
    posts: Post[]
  }

  let selectedPost: PostPreviewSidebarPost | undefined =
    undefined

  $: query = $page.url.searchParams.get('query') ?? undefined

  function filtersFromPosts(
    posts: Post[],
    key: 'tags' | 'locations',
    checkedFilters: string[]
  ) {
    return uniqBy(prop('slug'), posts.flatMap(prop(key)))
      .filter(prop('slug'))
      .map((filter) => ({
        ...filter,
        checked: checkedFilters.includes(filter.slug)
      }))
  }
</script>

<section>
  <h1 id={titleId} class={textClasses.titleSans}>
    {query ? $LL.search.results({query}) : 'Posts'}
  </h1>
  <FilterSidebar {query}>
    <FilterSidebarFieldset
      title="Tags"
      name="tags"
      filters={filtersFromPosts(
        data.posts,
        'tags',
        $page.url.searchParams.getAll('tag')
      )}
    />
    <FilterSidebarFieldset
      title="Locations"
      name="locations"
      filters={filtersFromPosts(
        data.posts,
        'locations',
        $page.url.searchParams.getAll('location')
      )}
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
